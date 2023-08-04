package io.confluent.cwcsample;

import lombok.extern.slf4j.Slf4j;
import io.confluent.kafka.serializers.KafkaAvroDeserializer;
import org.apache.avro.generic.GenericRecord;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/*
This class defines & creates a consumer via Spring Kafka. Additionally, we create
a listener that will send messages from the consumer to the websocket used by our UI.

For more info about using Spring and Kafka, see the following course on Confluent
Developer: https://developer.confluent.io/courses/spring/apache-kafka-intro/
 */
@EnableKafka
@Slf4j
public class Consumer {

    String bootstrapServer;
    String kafkaApiKey;
    String kafkaApiSecret;
    String srUrl;
    String srAuth;

    public Consumer(String bootstrapServer, String kafkaApiKey, String kafkaApiSecret, String srUrl, String srAuth) {
        this.bootstrapServer = bootstrapServer;
        this.kafkaApiKey = kafkaApiKey;
        this.kafkaApiSecret = kafkaApiSecret;
        this.srUrl = srUrl;
        this.srAuth = srAuth;
    }

    // Create a map of the configuration settings for the consumer
    // For Connect with Confluent native integrations, you'll be provided a specific client ID to include as a prefix
    // In this sample, this prefix is "cwc|sample", then we add a unique identifier on the end of it
    private Map<String, Object> consumerConfigurations() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServer);
        props.put("security.protocol", "SASL_SSL");
        props.put("sasl.mechanism", "PLAIN");
        props.put("sasl.jaas.config", "org.apache.kafka.common.security.plain.PlainLoginModule required username='" + kafkaApiKey + "'   password='" + kafkaApiSecret + "';");
        props.put("session.timeout.ms","45000");
        String uniqueID = UUID.randomUUID().toString();
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "cwc|sample-" + uniqueID);
        props.put(ConsumerConfig.CLIENT_ID_CONFIG, "cwc|sample-" + uniqueID);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
        props.put("schema.registry.url", srUrl);
        props.put("basic.auth.credentials.source", "USER_INFO");
        props.put("basic.auth.user.info", srAuth);
        return props;
    }

    // Create a "consumer factory" using the configuration settings defined above
    public ConsumerFactory<String, GenericRecord> consumerFactory() {
        return new DefaultKafkaConsumerFactory<>(consumerConfigurations());
    }

    // Create a consumer "container" for the topic from the "Consumer Factory"
    public ConcurrentMessageListenerContainer getConsumer(String topic, SimpMessagingTemplate simpMessagingTemplate) {
        //Define the container properties (topic to consume from), then create the container through the consumer factory
        ContainerProperties containerProps = new ContainerProperties(topic);
        ConcurrentMessageListenerContainer<String, GenericRecord> container =
                new ConcurrentMessageListenerContainer<>(consumerFactory(), containerProps);

        // For the sample application, we want to add a specific listener that sends each record to a websocket
        // To achieve this, we take each record and use Spring's SimpMessagingTemplate to send the message to
        // the `/consume` websocket endpoint
        container.setupMessageListener((MessageListener)
            record -> {
                ConsumerRecord consumerRecord = (ConsumerRecord) record;

                simpMessagingTemplate.convertAndSend("/consume", "{\"timestamp\": \"" + consumerRecord.timestamp() + "\",\"partition\": \"" + consumerRecord.partition() + "\",\"offset\": \"" + consumerRecord.offset() + "\", \"key\": \"" + consumerRecord.key() + "\", \"value\": " + consumerRecord.value() + "}");
        });
        return container;
    }

}
