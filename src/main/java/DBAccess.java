import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.UUID;

public class DBAccess {
    static CONFIG config = new CONFIG();

    @Nullable
    public static Boolean insertTask(String name, Integer description, Integer totalDuration) {
        try (Connection connection = DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword())){
            if (fetchTaskByName(name) == null) {
                String query = "INSERT INTO tasks (name, description, totalDuration) VALUES (?, ?, ?)";
                PreparedStatement insertStatement = connection.prepareStatement(query);
                insertStatement.setString(1, name);
                insertStatement.setInt(2, description);
                insertStatement.setInt(3, totalDuration);

                insertStatement.execute();
                return true;
            } else {
                return false;
            }
        } catch(Exception error){
            error.printStackTrace();
            return null;
        }
    }

    @Nullable
    public static Task fetchTaskByName(String name) {
        try (Connection connection = DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword())){
            String query = "SELECT * FROM tasks where name = ? LIMIT 1";
            PreparedStatement selectStatement = connection.prepareStatement(query);
            selectStatement.setString(1, name);

            ResultSet result = selectStatement.executeQuery();
            if (result.next()) {
                UUID id = UUID.fromString(result.getString("id"));
                String taskName = result.getString("name");
                int description = result.getInt("description");
                int totalDuration = result.getInt("totalDuration");
                return new Task(id, taskName, description, totalDuration);
            } else return null;

        } catch(Exception error){
            error.printStackTrace();
            return null;
        }
    }

    @Nullable
    public static ArrayList<Task> fetchTasks(String name) {
        ArrayList<Task> tasks = new ArrayList<>();
        try (Connection connection = DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword())){
            String query = "SELECT * FROM tasks where name LIKE ? LIMIT 10";
            PreparedStatement selectStatement = connection.prepareStatement(query);
            selectStatement.setString(1, "%" + name + "%");

            ResultSet result = selectStatement.executeQuery();
            while (result.next()) {
                UUID id = UUID.fromString(result.getString("id"));
                String taskName = result.getString("name");
                int description = result.getInt("description");
                int totalDuration = result.getInt("totalDuration");
                tasks.add(new Task(id, taskName, description, totalDuration));
            }

        } catch(Exception error){
            error.printStackTrace();
            return null;
        }
        return tasks;
    }

    @NotNull
    public static Boolean updateTask(Task task) {
        try (Connection connection = DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword())){
            String query = "UPDATE tasks SET name = ?, description = ?, totalDuration = ? WHERE id = ?";
            PreparedStatement insertStatement = connection.prepareStatement(query);
            insertStatement.setString(1, task.getName());
            insertStatement.setInt(2, task.getDescription());
            insertStatement.setInt(3, task.getTotalDuration());
            insertStatement.setString(4, task.getId().toString());

            insertStatement.execute();

            return true;

        } catch(Exception error){
            error.printStackTrace();
            return false;
        }
    }

    public static Boolean deleteTask(Task task) {
        try (Connection connection = DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword())){
            String query = "DELETE FROM tasks WHERE id = ?";
            PreparedStatement insertStatement = connection.prepareStatement(query);
            insertStatement.setString(1, task.getId().toString());

            insertStatement.execute();

            return true;

        } catch(Exception error){
            error.printStackTrace();
            return false;
        }
    }

    public static void initializedDB() {
        try (Connection connection = DriverManager.getConnection(config.getUrl(), config.getUsername(), config.getPassword())){
            PreparedStatement stm0 = connection.prepareStatement("DROP DATABASE taskManagement");
            PreparedStatement stm01 = connection.prepareStatement("CREATE DATABASE IF NOT EXISTS taskManagement");
            PreparedStatement stm02 = connection.prepareStatement("USE taskManagement");
            PreparedStatement stm03 = connection.prepareStatement("CREATE TABLE IF NOT EXISTS tasks (id varbinary(36) DEFAULT (uuid()) PRIMARY KEY, name varchar(150) NOT NULL, description int, totalDuration int)");
            PreparedStatement stm04 = connection.prepareStatement("CREATE TABLE IF NOT EXISTS material (id varbinary(36) DEFAULT (uuid()) PRIMARY KEY, partNumber varchar(150), manufacturerCode int, price int, unitOfIssue varbinary(36) CONSTRAINT fk_unitOfIssue FOREIGN KEY (id) REFERENCES unitOfIssues(id))");
            PreparedStatement stm05 = connection.prepareStatement("CREATE TABLE IF NOT EXISTS unitOfIssues (id varbinary(36) DEFAULT (uuid()) PRIMARY KEY, name varchar(150), type varchar(150))");

            stm0.execute();
            stm01.execute();
            stm02.execute();
            stm03.execute();
            stm04.execute();
            stm05.execute();

        } catch(Exception error){
            error.printStackTrace();
        }
    }
}