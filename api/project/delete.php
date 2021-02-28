<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods');

include_once('../core/initialize.php');

$project = new Project($db);

$data = json_decode(file_get_contents("php://input"));

$project->project_id = $data->project_id;
if ($project->delete()) {
    $group = new Group($db);
    for ($i = 1; $i <= 5; $i++) {
        $group->group_id = $i;

        if ($group->delete()) {
            echo json_encode(array(
                'message' => 'Group deleted'
            ));
        } else {
            echo json_encode(array(
                'message' => 'Group not deleted'
            ));
        }
    }
    echo json_encode(
        array('message' => 'Project deleted')
    );
} else {
    echo json_encode(
        array('message' => 'Project not deleted')
    );
}