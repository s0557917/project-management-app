import Subtask from "./Subtask";
import { ScrollArea } from '@mantine/core';

export default function Sublist({ tasks: subtasks }) {

  return (
    <div className="border-cyan-500">
      {(!subtasks || subtasks.length === 0)
        ? <p>No subtasks yet...</p> 
        : <ScrollArea style={{ height: 100 }}>
            <ul>
              {subtasks?.map(task => <Subtask taskData={task} key={task.id}/>)}
            </ul>
          </ScrollArea>}
    </div>
  );
}