<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

include_once('../core/initialize.php');

$student = new Student($db);

$result = $student->read();

$num = $result->rowCount();

if ($num >= 0) {
    $student_arr = array();
    $student_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $student = array(
            'student_id' => $student_id,
            'project_id' => $project_id,
            'assigned_group_id' => $assigned_group_id,
            'student_fullname' => $student_fullname,
            'is_assigned' => $is_assigned
        );
        array_push($student_arr['data'], $student);
    }
    echo json_encode($student_arr);
    
} else {
    echo json_encode(array('Message' => 'No Groups found'));
}