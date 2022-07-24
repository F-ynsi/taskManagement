import com.google.gson.Gson;
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;

class TaskSearchListResponse {
    private Boolean hasError;
    private ArrayList<Task> tasks;

    public TaskSearchListResponse(Boolean hasError, ArrayList<Task> tasks) {
        this.hasError = hasError;
        this.tasks = tasks;
    }
}

class GenericResponse {
    private final Boolean isSuccessful;

    public GenericResponse(Boolean isSuccessful) {
        this.isSuccessful = isSuccessful;
    }
}

public class Server {
    public static void main(String[] args) {
        if (!new CONFIG().isDBInitialized()){
            DBAccess.initializedDB();
        }

        Javalin app = Javalin.create(config -> config.addStaticFiles("./public", Location.EXTERNAL)).start(8080);

        app.get("/home", ctx -> {
            FileReader file = new FileReader("./public/index.html");
            BufferedReader bufferedReader = new BufferedReader(file);
            StringBuilder result = new StringBuilder();
            String line;
            while ( (line = bufferedReader.readLine()) != null) {
                result.append(line);
            }
            ctx.result(result.toString()).contentType("text/html");
            file.close();
            bufferedReader.close();
        });

        app.post("/createTask", ctx -> {
            Gson gson = new Gson();
            Task task = gson.fromJson(ctx.body(), Task.class);
            Boolean isInserted = DBAccess.insertTask(task.getName(), task.getDescription(), task.getTotalDuration());
            if (isInserted == null) {
                ctx.status(500);
            } else {
                ctx.json(gson.toJson(new GenericResponse(isInserted)));
            }
        });

        app.post("/editTask", ctx -> {
            Gson gson = new Gson();
            try {
                Task task = gson.fromJson(ctx.body(), Task.class);
                Boolean isUpdated = DBAccess.updateTask(task);
                ctx.json(gson.toJson(new GenericResponse(isUpdated)));
            } catch(Exception error) {
                error.printStackTrace();
                ctx.json(gson.toJson(new GenericResponse(false)));
            }
        });

        app.post("/deleteTask", ctx -> {
            Gson gson = new Gson();
            try {
                Task task = gson.fromJson(ctx.body(), Task.class);
                Boolean idDeleted = DBAccess.deleteTask(task);
                ctx.json(gson.toJson(new GenericResponse(idDeleted)));
            } catch(Exception error) {
                error.printStackTrace();
                ctx.json(gson.toJson(new GenericResponse(false)));
            }
        });

        app.get("/searchTaskByName/{nameSearch}", ctx -> {
            Gson gson = new Gson();
            String nameSearch = ctx.pathParamMap().get("nameSearch");
            ArrayList<Task> tasks = DBAccess.fetchTasks(nameSearch);
            if (tasks != null){
                ctx.json(gson.toJson(new TaskSearchListResponse(false, tasks)));
            } else {
                ctx.json(gson.toJson(new TaskSearchListResponse(true, null)));
            }
        });
    }
}