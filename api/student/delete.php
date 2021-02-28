<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods');

include_once('../core/initialize.php');

$student = new Student($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->student_id)) {
    $student->student_id = $data->student_id;
    if ($student->delete()) {
        echo json_encode(
            array('message' => 'Student deleted')
        );
    } else {
        echo json_encode(
            array('message' => 'Student not deleted')
        );
    }
}
