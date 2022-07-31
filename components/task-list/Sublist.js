import Subtask from "./Subtask";
import { ScrollArea } from '@mantine/core';

export default function Sublist({ tasks }) {
  return (
    <div class="border-cyan-500">
      {!tasks 
        ? <p>No subtasks yet...</p> 
        : <ScrollArea style={{ height: 100 }}>
            <ul>
              {tasks?.map(task => <Subtask taskData={task} key={task.id}/>)}
            </ul>
          </ScrollArea>}
    </div>
  );
}