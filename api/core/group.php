<?php

class Group extends Project
{

    private $table = 'groups';
    private $conn;

    public $group_id;
    public $project_name;
    public $students_per_group;

    public function __construct($db)
    {
        $this->conn = $db;
        parent::__construct($db);
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
        $query = 'INSERT INTO ' . $this->table . ' SET group_id = :group_id, project_name = :project_name, students_per_group = :students_per_group';
        $stmt = $this->conn->prepare($query);
        $this->group_id = htmlspecialchars(strip_tags($this->group_id));
        $this->project_name = htmlspecialchars(strip_tags($this->project_name));
        $this->students_per_group = htmlspecialchars(strip_tags($this->students_per_group));

        $stmt->bindParam(':group_id', $this->group_id);
        $stmt->bindParam(':project_name', $this->project_name);
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
