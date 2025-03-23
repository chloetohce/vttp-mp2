package vttp.project.mp2.model.game;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class BasicBot implements Bot {
    private static final String TYPE = "basic-bot";

    private static final int CALLS = 3;

    private int id;

    @Override
    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("type", TYPE)
            .add("calls", CALLS)
            .add("id", id)
            .build();
    }


}
