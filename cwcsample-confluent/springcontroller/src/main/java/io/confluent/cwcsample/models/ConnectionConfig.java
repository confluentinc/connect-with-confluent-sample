package io.confluent.cwcsample.models;

import lombok.Data;
import org.json.JSONObject;

import java.util.HashMap;

@Data
public class ConnectionConfig {
    private String type;
    private String name;
    private HashMap<String,String> details;
    private HashMap<String, HashMap<String, String>> clusterDetails;

    public ConnectionConfig(String type, String name, HashMap<String,String> details, HashMap<String, HashMap<String, String>> clusterDetails) {
        this.type = type;
        this.name = name;
        this.details = details;
        this.clusterDetails = clusterDetails;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public HashMap<String, String> getDetails() {
        return details;
    }

    public void setDetails(HashMap<String, String> details) {
        this.details = details;
    }

    public HashMap<String, HashMap<String, String>> getClusterDetails() {
        return clusterDetails;
    }

    public void setClusterDetails(HashMap<String, HashMap<String, String>> clusterDetails) {
        this.clusterDetails = clusterDetails;
    }
}
