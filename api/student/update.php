<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PATCH');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods');

include_once('../core/initialize.php');

$student = new Student($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->student_id) &&
    !empty($data->group_id) &&
    !empty($data->is_assigned)
) {

    $student->student_id = $data->student_id;
    $student->assigned_group_id = $data->group_id;
    $student->is_assigned = $data->is_assigned;

    if ($student->update()) {
        echo json_encode(
            array('message' => 'Student updated')
        );
    } else {
        echo json_encode(
            array('message' => 'Student not updated')
        );
    }
}
