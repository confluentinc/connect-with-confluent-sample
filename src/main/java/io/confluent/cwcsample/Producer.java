package io.confluent.cwcsample;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.SendResult;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/*
This class defines & creates a producer via Spring Kafka. Additionally, we create
a method that will be used to send a specific message to Kafka via this producer.

For more info about using Spring and Kafka, see the following course on Confluent
Developer: https://developer.confluent.io/courses/spring/apache-kafka-intro/
 */
@EnableKafka
@Slf4j
public class Producer {

    String bootstrapServer;
    String kafkaApiKey;
    String kafkaApiSecret;
    String srUrl;
    String srAuth;

    public Producer(String bootstrapServer, String kafkaApiKey, String kafkaApiSecret, String srUrl, String srAuth) {
        this.bootstrapServer = bootstrapServer;
        this.kafkaApiKey = kafkaApiKey;
        this.kafkaApiSecret = kafkaApiSecret;
        this.srUrl = srUrl;
        this.srAuth = srAuth;
    }

    // Create a map of the configuration settings for the producer
    // For Connect with Confluent native integrations, you'll be provided a specific client ID to include as a prefix
    // In this sample, this prefix is "cwc|sample", then we add a unique identifier on the end of it
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put("bootstrap.servers", bootstrapServer);
        props.put("security.protocol", "SASL_SSL");
        props.put("sasl.mechanism", "PLAIN");
        props.put("sasl.jaas.config", "org.apache.kafka.common.security.plain.PlainLoginModule required username='" + kafkaApiKey + "'   password='" + kafkaApiSecret + "';");
        props.put("acks", "all");
        props.put("session.timeout.ms","45000");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        if (srUrl != null & srAuth != null) {
            props.put("schema.registry.url", srUrl);
            props.put("basic.auth.credentials.source", "USER_INFO");
            props.put("basic.auth.user.info", srAuth);
        }
        String uniqueID = UUID.randomUUID().toString();
        props.put(ProducerConfig.CLIENT_ID_CONFIG,"cwc|sample-" + uniqueID);
        return new DefaultKafkaProducerFactory<>(props);
    }

    //Create a producer ("KafkaTemplate" in Spring)
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    //We define a produce method to send a message to a topic
    public void produceMessage(String topic, String message){
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate().send(topic, message);
        future.whenComplete((result, exception) -> {
            if (exception == null) {
                log.debug("Sent message=[" + message + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                log.debug("Unable to send to kafka");
            }
        });
    }
}
