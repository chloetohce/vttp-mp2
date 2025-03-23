package vttp.project.mp2.model;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Bot {
    private String type;

    private int calls;

    private long id;

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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }



    

}
