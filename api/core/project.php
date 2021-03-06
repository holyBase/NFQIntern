<?php

class Project
{

    private $conn;
    private $table = 'projects';

    public $project_id;
    public $project_name;
    public $number_of_groups;
    public $students_per_group;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM ' . $this->getTable();

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function create()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET project_name = :project_name, number_of_groups = :number_of_groups, students_per_group = :students_per_group';
        $stmt = $this->conn->prepare($query);
        $this->project_name = htmlspecialchars(strip_tags($this->project_name));
        $this->number_of_groups = htmlspecialchars(strip_tags($this->number_of_groups));
        $this->students_per_group = htmlspecialchars(strip_tags($this->students_per_group));

        $stmt->bindParam(':project_name', $this->project_name);
        $stmt->bindParam(':number_of_groups', $this->number_of_groups);
        $stmt->bindParam(':students_per_group', $this->students_per_group);

        if ($stmt->execute()) {
            return true;
        } else {
            printf("Error %s. \n", $stmt->error);
            return false;
        }
    }

    public function getTable()
    {
        return $this->table;
    }
}
