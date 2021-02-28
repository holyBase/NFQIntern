<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PATCH');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods');

include_once('../core/initialize.php');

$project = new Project($db);

$data = json_decode(file_get_contents("php://input"));

$project->project_id = $data->project_id;
$project->project_name = $data->project_name;
$project->number_of_groups = $data->number_of_groups;
$project->students_per_group = $data->students_per_group;

if ($project->update()) {
    echo json_encode(
        array('message' => 'Post updated')
    );
} else {
    echo json_encode(
        array('message' => 'Post not updated')
    );
}