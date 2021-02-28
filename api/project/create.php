<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type');

include_once('../core/initialize.php');

$project = new Project($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->project_name) &&
    !empty($data->number_of_groups) &&
    !empty($data->students_per_group)
) {

    $project->project_name = $data->project_name;
    $project->number_of_groups = $data->number_of_groups;
    $project->students_per_group = $data->students_per_group;

    if ($project->create()) {
        $group = new Group($db);
        for ($i = 1; $i <= $project->number_of_groups; $i++) {
            $group->group_id = $i;
            $group->project_name = $project->project_name;
            $group->students_per_group = $project->students_per_group;

            if ($group->create()) {
                echo json_encode(array('group_message' => $group->group_id + 'group created'));
            }
        }
        http_response_code(201);

        return json_encode(
            array('message' => 'Project created')
        );
    } else {
        http_response_code(503);

        return json_encode(
            array('message' => 'Project not created')
        );
    }
} else {
    http_response_code(400);

    return json_encode(array('message' => 'Unable to create project. Data is incomplete'));
}
