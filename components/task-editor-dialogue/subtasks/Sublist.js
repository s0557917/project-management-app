import Subtask from "./Subtask";
import { ScrollArea } from '@mantine/core';
import getThemeColor from "../../../utils/color/getThemeColor";

export default function Sublist({ subtasks, newSubtasks, categories, onSubtaskClicked, onSubtaskRemoved }) {
  const textColor = getThemeColor('text-gray-900', 'text-white');

  return (
    <div>
      {(!subtasks || subtasks.length === 0 && (!newSubtasks || newSubtasks.length === 0))
        ? <p className={textColor}>No subtasks yet...</p> 
        : <ScrollArea style={{ height: 100 }} offsetScrollbars>
            <ul>
              {
                subtasks?.map(task => {
                  return <Subtask 
                    task={task} 
                    categories={categories} 
                    key={task.id}
                    onSubtaskClicked={onSubtaskClicked}
                    textSize={'text-md'}
                    circleSize={20}
                    removable={true}
                    onSubtaskRemoved={onSubtaskRemoved}
                  />
                })
              }
              {
                newSubtasks?.map(task => {
                  return <Subtask 
                    task={task} 
                    categories={categories} 
                    key={task.id}
                    onSubtaskClicked={onSubtaskClicked}
                    textSize={'text-md'}
                    circleSize={20}
                    removable={true}
                    onSubtaskRemoved={onSubtaskRemoved}
                  />
                })
              }
            </ul>
          </ScrollArea>}
    </div>
  );
}