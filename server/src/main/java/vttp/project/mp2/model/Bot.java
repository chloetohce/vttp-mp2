package vttp.project.mp2.model;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Bot {
    private String type;

    private int calls;

    private int id;

    private String name;

    private String code;

    private String username;

    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("type", type)
            .add("calls", calls)
            .add("id", id)
            .build();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCalls() {
        return calls;
    }

    public void setCalls(int calls) {
        this.calls = calls;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "Bot [type=" + type + ", calls=" + calls + ", id=" + id + ", name=" + name + ", code=" + code + "]";
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    
    
    

}
