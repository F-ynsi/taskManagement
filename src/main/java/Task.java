import java.util.UUID;

public class Task {
    private UUID id;
    private String name;
    private Integer description;
    private Integer totalDuration;

    public Task(UUID id, String name, Integer description, Integer totalDuration) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.totalDuration = totalDuration;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getDescription() {
        return description;
    }

    public Integer getTotalDuration() {
        return totalDuration;
    }
}
