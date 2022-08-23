import Subtask from "./Subtask";
import { ScrollArea } from '@mantine/core';

export default function Sublist({ tasks, categories, onSubtaskClicked, onSubtaskRemoved }) {
  return (
    <div className="border-cyan-500">
      {(!tasks || tasks.length === 0)
        ? <p>No subtasks yet...</p> 
        : <ScrollArea style={{ height: 100 }} offsetScrollbars>
            <ul>
              {tasks?.map(task => 
                <Subtask 
                  task={task} 
                  categories={categories} 
                  key={task.id}
                  onSubtaskClicked={onSubtaskClicked}
                  textSize={'text-md'}
                  circleSize={20}
                  removable={true}
                  onSubtaskRemoved={onSubtaskRemoved}
                />
              )}
            </ul>
          </ScrollArea>}
    </div>
  );
}