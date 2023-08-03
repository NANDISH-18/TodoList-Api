import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react'
import todoimage from '../image/todo.png'
import '../Style/style.css'
import {ToastContainer, toast} from 'react-toastify'

const Todolist = () => {

    // State Variables
    const [tasks,setTasks] = useState([]) //Holds the list of the tasks
    const [inputValue , setInputValue] = useState('') //Holds the value of input field
    const [filter , setFilter] =  useState('all') //Holds the current filter type
    const [editTaskId, setEditTaskId] = useState(null) //Holds the ID of the task being edited
    const [isLoading , setIsLoading] = useState(true) //Wheather the data is being loaded

    // fetch initial data
    useEffect(() => {
        fetchTodos();
    },[]);

    // Fetch todos from API
    const fetchTodos = async () =>{
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4');
            const todos = await response.json();
            setTasks(todos);
            setIsLoading(false);
        } catch (error) {
            console.log("Error fetching todos",error);
            setIsLoading(false);
        }
    }

    // Add a new task
    const handleAddNewTask = async () => {

        if(inputValue.trim() === ''){
            return;
        }

        const newTask ={
            title: inputValue,
            completed: false
        }

        try {
            const response =  await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify(newTask),
                headers: {
                    'Content-type' : 'application/json; charset=UTF-8'
                }
            });
            console.log("response",response)
            const addedTask = await response.json();
            console.log("added task",addedTask);
            setTasks((prevTasks) => [...prevTasks,addedTask]);
            setInputValue('');
            console.log('Task addded successfully')
            toast.success('Task addded successfully');
        } catch (error) {
            console.log('Error adding task',error);
            toast.error('Error in adding task');
        }
    }

    // update a new task
    const handleUpdateTask =  async () => {
        if(editTaskId === null || inputValue.trim() === ''){
            return;
        }

        const updatedTask = {
            title: inputValue,
            completed: false
        }

        console.log("task id: ",editTaskId);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editTaskId}`,{
                                         
                method: 'PUT',
                body: JSON.stringify(updatedTask),
                headers: {
                    'Content-type' : 'application/json; charset=UTF-8'
                },
            });
            console.log("task id: ",editTaskId);
            const updatedTaskData = await response.json();
            setTasks((prevTasks) => 
                prevTasks.map((task) => 
                    task.id === editTaskId ? {...task, title: updatedTaskData.title}: task));
            setInputValue('');
            setEditTaskId(null);
            toast.success('Task updated successfully');

        } catch (error) {
            console.log('Error updating task:',error);
            toast.error('Error updating task');
        }


    }


    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handle checkbox change for a task
    const handleTaskCheckBoxChange =(taskid) => {
        setTasks((prevTasks) => prevTasks.map((task) => task.id === taskid ? {...task , completed: !task.completed} : task))
    }

    //Delete task
    const handleDeleteTask = (taskid) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskid));
        toast.success('Task deleted successfully');
    }
    // handle edit task
    const handleEditTask =(taskid) => {
        if(taskid === null){
            // If taskid is null, it means we are adding a new task
            setEditTaskId(null); // Set editTaskId to null to indicate it's a new task
            setInputValue(''); // Clear the input field
        }else{
            // If taskid is not null, it means we are editing an existing task
            setEditTaskId(taskid); // Set editTaskId to the taskid being edited
            const taskToEdit = tasks.find((task) => task.id === taskid);
            setInputValue(taskToEdit.title); // Set the input field value to the task title being edited
        }
    }

    // Handle complete tasks
    const handleCompleteAll = () => {
        setTasks((prevTasks) => prevTasks.map((task) => ({...task,completed:true})));
    }

    // clear complete task
    const handleClearComplete = () => {
        setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    }

    // HandleFilterChange
    const handleFilterChange = (filterType) => {
        setFilter(filterType);
    }

    // filter task
    const filterTasks = tasks.filter((task) => {
        if(filter === 'all'){
            return true;
        }else if(filter === 'completed'){
            return task.completed;
        }else if(filter === 'uncompleted'){
            return !task.completed;
        }
    })

    // Display loading message while data is being fetched
    if(isLoading){
        return <div>Loading...</div>
    }


    return(
        
        <div className="container">
            <ToastContainer/>
            <div className="todo-app">
                <h2>
                    <img src={todoimage} alt="todo-image" /> Todo List
                </h2>
           
                <div className="row">
                    <i className="fas fa-list-check"></i>
                    <input type="text" className="add-task" id="add" placeholder="Add your todo" autoFocus onChange={handleInputChange} />
                    <button id="btn" onClick={editTaskId ? handleUpdateTask : handleAddNewTask}>{editTaskId ? 'Update' : 'Add'}</button>
                </div>

                <div className="mid">
                    <i className='fas fa-check-double'></i>
                    <p id='complete-all' onClick={handleCompleteAll}>Complete all tasks</p>
                    <p id='clear-all' onClick={handleClearComplete}>Delete complete tasks</p>

                </div>
                <ul id='list'>
                    {filterTasks.map((task)=> (
                    <li key={task.id}>
                        <input type="checkbox" id={`task-${task.id}`} data-id={task.id} className='custom-checkbox' checked={task.completed} onChange={()=> handleTaskCheckBoxChange(task.id)}/>
                        <label htmlFor={`task-${task.id}`}>{task.title}</label>
                        <div >
                            <img src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" data-id={task.id} className='edit' onClick={() => handleEditTask(task.id)}/>
                            <img src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png" data-id={task.id} className='delete' onClick={() => handleDeleteTask(task.id)}/>
                        </div>
                    </li>
                    ))}
                </ul> 

                 {/* filters */}
                <div className='filters'>
                    <div className='dropdown'>
                        <button className='dropbtn'>Filter</button>
                        <div className='dropdown-content'>
                            <a href="#" id='all' onClick={()=> handleFilterChange('all')}>All</a>
                            <a href="#" id='rem' onClick={()=> handleFilterChange('uncompleted')}>Uncomplete</a>
                            <a href="#" id='com' onClick={()=> handleFilterChange('completed')}>Completed</a>
                        </div>
                    </div>

                    <div className='completed-task'>
                        <p>
                            Completed: <span id='c-count'>{tasks.filter((task) =>  task.completed).length}</span>
                        </p>
                    </div>
                    <div className='remaining-task'>
                        <p>
                            <span id='total-task'>
                                Total Tasks: <span id='tasks-counter'>{tasks.length}</span>
                            </span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Todolist;
