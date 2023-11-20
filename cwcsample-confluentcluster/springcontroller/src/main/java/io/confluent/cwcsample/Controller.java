package io.confluent.cwcsample;

import io.confluent.cwcsample.models.ConnectionConfig;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.ByteBuffer;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Flow;

/*
This class defines the endpoints needed to support the front end of the sample.
The following endpoints are defined and grouped into endpoints that interact with Confluent Cloud or are
created solely to support the sample application.

CONFLUENT CLOUD SPECIFIC ENDPOINTS:
- LIST TOPICS: show all topics in the cluster
- PRODUCE: create a producer and send a message
- CONSUME: create a consumer and retrieve messages from a topic

SAMPLE APPLICATION SPECIFIC ENDPOINTS:
- ADD CONNECTION: store connection info used to connect to Confluent Cloud
- LIST CONNECTIONS: show available connections

A native integration will likely not require some these endpoints. For example, if an integration does not
display messages in the UI, you will likely not need a consume endpoint because you'd create your consumer
when the Confluent Cloud connection is created/started.
 */
@RestController
@RequestMapping(value = "/api")
public class Controller {

    //For this sample application, we render messages in the UI, so we use a websocket and Spring's messaging framework
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    //Create a store to track our active connections/applications
    private Map<String, ConcurrentMessageListenerContainer<String, String>> activeConsumers = new HashMap<>();

    //Create a store to keep all the connection information
    // IMPORTANT -----> ALWAYS USE A REAL VAULT / SECURE KEYSTORE <-------
    private ConcurrentHashMap<String,ConnectionConfig> connectionsVault = new ConcurrentHashMap<>();

    //For this sample, we load some fake connections into the connectionsVault
    @PostConstruct
    private void init() {
        connectionsVault.put("S3",new ConnectionConfig("s3bucket","Dev - S3 Bucket", new HashMap<>()));
        connectionsVault.put("MongoDB",new ConnectionConfig("mongodb","MongoDB Prod", new HashMap<>()));
    }

    // Define an endpoint to return the topics available in the Confluent cluster defined in the request url
    // We use the Confluent API for obtaining the topics, which uses the base of the bootstrap server url, but you could alternatively use the KafkaAdmin API which is available at the bootstrap server
    @GetMapping(value = "/connections/confluentcluster/{connectionName}/{clusterId}/topics")
    public ResponseEntity<String> getTopics(@PathVariable String connectionName, @PathVariable String clusterId) throws IOException, InterruptedException {

        //Retrieve the bootstrap server from the "connections vault"
        //****REMINDER: Use a secure location for storing your connection information*****
        URL bootstrapUrl = new URL(connectionsVault.get(connectionName).getDetails().get("bootstrapServer"));
        //Trim port off the bootstrap server's url for use with the Confluent Cloud API
        bootstrapUrl = new URL(bootstrapUrl.getProtocol(), bootstrapUrl.getHost(), bootstrapUrl.getFile());

        //Confluent Cloud API format = https://pkc-00000.region.provider.confluent.cloud/kafka/v3/clusters/<cluster-id>/topics
        String url = bootstrapUrl + "/kafka/v3/clusters/" + clusterId + "/topics";

        //Create & send the GET request to obtain the topics using the kafka credentials with Basic auth (base64 encoded API key + secret)
        HttpClient client = HttpClient.newBuilder().build();
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .uri(URI.create(url))
                .headers("Authorization", "Basic " + connectionsVault.get(connectionName).getDetails().get("kafkaCredentials"))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // Return the topics from the Confluent Cloud API response
        // for this sample, we choose the return the data object only
        JSONObject jsonResponse =  new JSONObject(response.body());
        return ResponseEntity.ok().body(jsonResponse.getJSONArray("data").toString());
    }

    // Define an endpoint to produce to the topic requested in the url
    @PostMapping(value = "/connections/confluentcluster/{connectionName}/{clusterId}/topic/{topic}/produce")
    public void produce(@PathVariable String clusterId, @PathVariable String connectionName, @PathVariable String topic, @RequestBody String event){
        //Retrieve the connection information (bootstrap server, Kafka API key & Secret, and Schema Registry connection details) from the "connections vault"
        //****REMINDER: Use a secure location for storing your connection information*****
        HashMap<String,String> connectionDetails = connectionsVault.get(connectionName).getDetails();

        // Define/create a producer using the connection details.
        Producer producer = new Producer(connectionDetails.get("bootstrapServer"),connectionDetails.get("kafkaApiKey"), connectionDetails.get("kafkaApiSecret"), connectionDetails.get("srUrl)"), connectionDetails.get("srApiKey") + ":" + connectionDetails.get("srSecret") );
        // Then use the `produceMessage` method to send the message/event from the request body received to the controller
        producer.produceMessage(topic,event);
    }

    // Define an endpoint to create a new consumer to read messages from the topic requested in the url
    // When this endpoint is called, we create (or reuse) a consumer for the topic and publish those messages to a websocket
    // Our frontend connects to the websocket to display the messages as they arrive
    // Most use cases will forgo the websocket and instead push the messages to wherever your application will leverage that data
    @GetMapping(value = "/connections/confluentcluster/{connectionName}/{clusterId}/topic/{topic}/consume")
    public void consume(@PathVariable String connectionName, @PathVariable String clusterId, @PathVariable String topic){
        // For this sample, we don't want consumers to remain running, so we first stop any running consumers
        // (we do this to prevent duplicate messages or messages from other topics being sent to the websocket)
        // In a real scenario, once the connection is created, you'd want consumers to remain available/running
        // and sending data to the target within your application ecosystem
        for (String container : activeConsumers.keySet()){
            activeConsumers.get(container).stop();
        }
        // Check if a consumer already exists that can be reused
        // If one exists for the topic in question, start the consumer
        if (activeConsumers.containsKey(clusterId + "-" + topic)) {
            ConcurrentMessageListenerContainer container = activeConsumers.get(clusterId + "-" + topic);
            if (!container.isRunning()) {
                container.start();
            }
        }
        // If a consumer does not already exist that can be reused, create one and start it
        else {
            //Retrieve the connection information (bootstrap server, Kafka API key & Secret, and Schema Registry connection details) from the "connections vault"
            //****REMINDER: Use a secure location for storing your connection information*****
            HashMap<String, String> connectionDetails = connectionsVault.get(connectionName).getDetails();

            // Define/create a consumer using the connection details
            // Define a "Listener" (consumer) that will route messages from the topic to the websocket
            // In real scenarios, your consumer will do other things with the messages,
            // such as send them to your other internal applications
            Consumer consumer = new Consumer(connectionDetails.get("bootstrapServer"), connectionDetails.get("kafkaApiKey"), connectionDetails.get("kafkaApiSecret"), connectionDetails.get("srUrl"), connectionDetails.get("srApiKey") + ":" + connectionDetails.get("srSecret"));
            ConcurrentMessageListenerContainer container = consumer.getConsumer(topic, simpMessagingTemplate);

            // Add the newly created consumer/listener to our list of active consumers
            activeConsumers.put(clusterId + "-" + topic, container);

            // Start the consumer
            container.start();
        }
    }

    // Define an endpoint to list the connections available to the sample application
    // Note: This endpoint is only created to support the sample application itself
    @GetMapping(value = "/connections")
    public ResponseEntity<ConcurrentHashMap<String, ConnectionConfig>> getConnections(){
        // Retrieve the list of connections from the connections vault
        //****REMINDER: Use a secure location for storing your connection information*****
        // return a response with the connections
        return ResponseEntity.ok().body(connectionsVault);
    }

    // Define an endpoint to add a new Confluent Cluster connection to the sample application
    // This connects directly to a specific Confluent Kafka Cluster + Schema Registry
    // Note: This endpoint is only created to support the sample application itself
    // The body in the request will include the connection information for Confluent Cloud,
    // including Kafka API key/secret, bootstrap server, & cluster ID
    @PostMapping(value = "/connections/add/confluentcluster/{connectionName}")
    public ResponseEntity<String> addConfluentClusterConnection(@PathVariable String connectionName, @RequestBody String body){

        //convert the body of the message to JSON for easier retrieval of objects defining the connection
        JSONObject bodyJson = new JSONObject(body);

        // Encode the Kafka key/secret for easier access when connecting to Confluent Cloud endpoints
        String credentials = Base64.getEncoder().encodeToString((bodyJson.get("apiKey") + ":" + bodyJson.get("secret")).getBytes());

        // Create a map to store all the connection details
        HashMap<String,String> connectionDetails = new HashMap<>();
        connectionDetails.put("kafkaApiKey",bodyJson.get("apiKey").toString());
        connectionDetails.put("kafkaApiSecret",bodyJson.get("secret").toString());
        connectionDetails.put("kafkaCredentials", credentials);
        connectionDetails.put("bootstrapServer", bodyJson.get("bootstrapServer").toString());
        connectionDetails.put("clusterId",bodyJson.get("clusterId").toString());
        connectionDetails.put("srUrl",bodyJson.get("srUrl").toString());
        connectionDetails.put("srApiKey",bodyJson.get("srApiKey").toString());
        connectionDetails.put("srSecret",bodyJson.get("srSecret").toString());
        ConnectionConfig newConnectionConfig = new ConnectionConfig("confluentcluster",connectionName,connectionDetails);

        // Add the connection to the connections vault
        //****REMINDER: Use a secure location for storing your connection information*****
        connectionsVault.put(connectionName, newConnectionConfig);

        // Return a success response
        return ResponseEntity.ok().body("");
    }

}
