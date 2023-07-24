package io.confluent.cwcsample.models;

import lombok.Data;

import java.util.HashMap;

@Data
public class Connection {
    private Long id;
    private String type;
    private String name;
    private HashMap<String,String> details;

    public Connection(String type, String name, HashMap<String, String> details) {
        this.type = type;
        this.name = name;
        this.details = details;
    }
}
