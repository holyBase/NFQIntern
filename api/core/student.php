<?php

class Student extends Group
{

    private $table = 'students';
    private $conn;

    public $student_id;
    public $project_id;
    public $assigned_group_id;
    public $student_fullname;
    public $is_assigned = false;

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
        $query = 'INSERT INTO ' . $this->table . ' SET 
        project_id = :project_id, 
        student_fullname = :student_fullname,
        is_assigned = :is_assigned';
        $stmt = $this->conn->prepare($query);
        $this->project_id = htmlspecialchars(strip_tags($this->project_id));
        $this->student_fullname = htmlspecialchars(strip_tags($this->student_fullname));

        $stmt->bindParam(':project_id', $this->project_id);
        $stmt->bindParam(':student_fullname', $this->student_fullname);
        $stmt->bindParam(':is_assigned', $this->is_assigned);

        if ($stmt->execute()) {
            return true;
        } else {
            printf("Error %s. \n", $stmt->error);
            return false;
        }
    }

    public function delete()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE student_id = :student_id';
        $stmt = $this->conn->prepare($query);
        $this->student_id = htmlspecialchars(strip_tags($this->student_id));
        $stmt->bindParam(':student_id', $this->student_id);
        if ($stmt->execute()) {
            return true;
        } else {
            printf("Error %s. \n", $stmt->error);
            return false;
        }
    }

    public function update()
    {
        $query = 'UPDATE ' . $this->table . ' 
        SET assigned_group_id = :group_id, is_assigned = :is_assigned WHERE student_id = :student_id';
        $stmt = $this->conn->prepare($query);
        $this->student_id = htmlspecialchars(strip_tags(($this->student_id)));
        $this->assigned_group_id = htmlspecialchars(strip_tags(($this->assigned_group_id)));
        $this->is_assigned = htmlspecialchars(strip_tags(($this->is_assigned)));

        $stmt->bindParam(':student_id', $this->student_id);
        $stmt->bindParam(':group_id', $this->assigned_group_id);
        $stmt->bindParam(':is_assigned', $this->is_assigned);

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
