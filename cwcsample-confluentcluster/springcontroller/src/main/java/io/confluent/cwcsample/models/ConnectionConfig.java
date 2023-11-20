package io.confluent.cwcsample.models;

import lombok.Data;
import org.json.JSONObject;

import java.util.HashMap;

@Data
public class ConnectionConfig {
    private String type;
    private String name;
    private HashMap<String,String> details;

    public ConnectionConfig(String type, String name, HashMap<String, String> details) {
        this.type = type;
        this.name = name;
        this.details = details;
    }
}
