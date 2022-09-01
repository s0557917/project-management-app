import getThemeColor from "../../../utils/color/getThemeColor";
import Task from "../task/Task"
import ListBlockContainer from "./ListBlockContainer"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../../../utils/db/queryFunctions/categories";
import EditModal from "./Modals/EditModal";
import DeleteModal from "./Modals/DeleteModal";
import { useState } from "react";
import { updateCategory } from "../../../utils/db/queryFunctions/categories";
import { showNotification } from '@mantine/notifications';
import TaskEditorDialogue from "../../task-editor-dialogue/TaskEditorDialogue";
import { addNewTask } from "../../../utils/db/queryFunctions/tasks";

export default function ListBlock({tasks, categories, onTaskClicked, onCompletionStateChanged, category, title, active, displayIcons}) {
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const deleteCategorMutation = useMutation(
        (categoryId) => deleteCategory(categoryId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('categories');
                showNotification({
                    autoClose: 3000,
                    type: 'success',
                    color: 'green',
                    title: 'Category successfully deleted!',
                });
            }
        }
    );

    const newTaskMutation = useMutation(
        (newTask) => addNewTask(newTask),
        {
            onSuccess: async () => {
                queryClient.invalidateQueries('tasks');
                setIsNewTaskModalOpen(false);
                showNotification({
                    autoClose: 3000,
                    type: 'success',
                    color: 'green',
                    title: 'New category saved successfully!',
                });
            }
        }
    );

    const updateCategoryMutation = useMutation(
        (updatedCategory) => updateCategory(updatedCategory),
        {onSuccess: async () => {
            queryClient.invalidateQueries('categories');
            showNotification({
                autoClose: 3000,
                type: 'success',
                color: 'green',
                title: 'Category updated successfully!',
            });
        }}
    )

    function getCategory(task) {
        if(category) {
            return category;
        } else if(task.categoryId !== '' && categories) {
            return categories.find(category => category.id === task.categoryId);
        } else {
            return '';
        }
    }

    function generateCategoryContent() {
        const mappedTasks = tasks?.map(task => {
            return <Task 
                taskData={task} 
                onTaskClicked={onTaskClicked} 
                onCompletionStateChanged={onCompletionStateChanged}
                category={getCategory(task)} 
                key={task.id}
            />
        })

        return (mappedTasks?.length > 0 
            ? mappedTasks 
            : <div className="p-2 flex items-center">
                <p className={`text-gray-900' text-md`}>No tasks in this category yet...</p>
                <button 
                    className="rounded-full text-xl bg-green-600 hover:scale-105 active:scale-95 text-white ml-3 w-7 h-7 justify-center"
                    onClick={() => setIsNewTaskModalOpen(true)}    
                >
                    <span className="justify-self-center">+</span>
                </button>
            </div>);
    }

    function onOpenCategoryEditor() {
        setIsEditModalOpen(true);
    }

    function onRemoveCategory() {
        setIsDeleteModalOpen(true);
    }

    function performEdit(modifiedCategory) {
        if(modifiedCategory.title === '' || modifiedCategory.color === '#d4d4d4') {
            showNotification({
                autoClose: 3000,
                type: 'error',
                color: 'red',
                title: 'Error updating your category!',
                message: 'Please ensure that you select a color and a title for your category!'
            });
        } else {
            setIsEditModalOpen(false);
            updateCategoryMutation.mutate({...modifiedCategory, id: category.id});
        }
    }

    function performDeletion(shouldDelete)  {
        setIsDeleteModalOpen(false);

        if(shouldDelete) {
            deleteCategorMutation.mutate(category.id);
        }
    }

    function onNewTaskSaved(taskData) {
        newTaskMutation.mutate(taskData);
    }

    return (
        <div className={`rounded-md w-4/5 mx-auto bg-zinc-800`}>
            {
                active &&
                <ListBlockContainer 
                    title={title || ''}
                    color={category?.color || ''}
                    onEdit={onOpenCategoryEditor}
                    onRemove={onRemoveCategory}
                    displayIcons={displayIcons}
                >
                    <div>
                        { generateCategoryContent() }
                    </div>
                </ListBlockContainer>
            }
            <EditModal 
                opened={isEditModalOpen}
                setOpened={setIsEditModalOpen}
                category={category}
                performEdit={performEdit}
            />
            <DeleteModal 
                opened={isDeleteModalOpen}
                setOpened={setIsDeleteModalOpen}
                categoryName={category.name}
                setShouldDelete={performDeletion}
            />

            <TaskEditorDialogue 
                tasks={tasks} 
                categories={categories}
                category={category}
                modalState={[isNewTaskModalOpen, setIsNewTaskModalOpen]} 
                saveNewTaskCallback={onNewTaskSaved}
            />
        </div>
    )
}