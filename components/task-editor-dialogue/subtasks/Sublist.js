import Subtask from "./Subtask";
import { ScrollArea } from '@mantine/core';
import getThemeColor from "../../../utils/color/getThemeColor";

export default function Sublist({ tasks, categories, onSubtaskClicked, onSubtaskRemoved }) {
  return (
    <div className="border-cyan-500">
      {(!tasks || tasks.length === 0)
        ? <p className={`${getThemeColor('text-gray-900', 'text-white')}`}>No subtasks yet...</p> 
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