package io.confluent.cwcsample.models;

import lombok.Data;

@Data
public class Environment {
    private String id;
    private String displayName;

    public Environment(String id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }
}
