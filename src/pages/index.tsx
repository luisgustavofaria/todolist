import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';

import {
  ContainerFavoriteOrNo,
  ContainerList,
  ContainerTodo,
  Task,
} from '@/components/CardsStyles/styles';
import Header from '@/components/Header';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import { searchAtom } from '../components/Header/Search';
import axios from 'axios';

export interface ITodoList {
  id: string;
  titleTodoList: string;
  textAreaTodoList: string;
  isFavorited: boolean;
  color: string;
}

export default function Home() {
  const [todoForm, setTodoForm] = useState<ITodoList[]>([]);

  async function getTodo() {
    const response = await axios.get('http://localhost:3333/todo/list-many');

    setTodoForm(response.data);
  }

  useEffect(() => {
    getTodo();
  }, []);

  async function addTodoList(
    titleNew: string,
    textAreaNew: string,
    isFavorited: boolean
  ) {
    const data = {
      titleTodoList: titleNew,
      textAreaTodoList: textAreaNew,
      isFavorited,
      color: '#FFFFFF',
    };

    const todo = await axios.post('http://localhost:3333/todo/create', data);
    setTodoForm((oldState) => [...oldState, todo.data]);
  }

  async function deleteTodoListById(todoListId: string) {
    const newTodoForm = todoForm.filter(
      (todoList) => todoList.id !== todoListId
    );
    setTodoForm(newTodoForm);
    await axios.delete('http://localhost:3333/todo/delete-unique', {
      params: { todo_id: todoListId },
    });
  }

  async function editColorById(todoListId: string, color: string) {
    const editColor = todoForm.find((el) => el.id === todoListId);
    if (editColor) {
      const colorEdited = {
        ...editColor,
        todo_id: editColor.id,
        color,
      };
      const newTodoList = todoForm.map((el) =>
        el.id === todoListId ? colorEdited : el
      );
      setTodoForm(newTodoList);
      await axios.put('http://localhost:3333/todo/update-unique', colorEdited);
    }
  }

  async function editTodoListById(
    todoListId: string,
    title: string,
    textarea: string
  ) {
    const todoListToEdit = todoForm.find((el) => el.id === todoListId);

    if (todoListToEdit) {
      const todoListEdited = {
        ...todoListToEdit,
        todo_id: todoListToEdit.id,
        titleTodoList: title,
        textAreaTodoList: textarea,
      };
      const newTodoList = todoForm.map((el) =>
        el.id === todoListId ? todoListEdited : el
      );
      setTodoForm(newTodoList);
      await axios.put(
        'http://localhost:3333/todo/update-unique',
        todoListEdited
      );
    }
  }

  async function toggleFavorited(id: string) {
    const newTodoForm = todoForm.map((todoList) => {
      if (todoList.id === id) {
        axios
          .put('http://localhost:3333/todo/update-unique', {
            todo_id: todoList.id,
            isFavorited: !todoList.isFavorited,
          })
          .then((r) => r);
        return {
          ...todoList,
          isFavorited: !todoList.isFavorited,
        };
      }
      return todoList;
    });
    setTodoForm(newTodoForm);
  }

  const searchValue = useAtomValue(searchAtom).toLocaleLowerCase();

  const list = useMemo(() => {
    const filterTodos = todoForm.filter(
      (task) =>
        `${task.titleTodoList?.toLocaleLowerCase()}${task.textAreaTodoList?.toLocaleLowerCase()}`.includes(
          searchValue
        ) ||
        (!task.isFavorited && task.isFavorited)
    );

    const filterReorganize = filterTodos.sort((a, b) =>
      Number(a.isFavorited > b.isFavorited) === 1 ? -1 : 0
    );

    return filterReorganize;
  }, [searchValue, todoForm]);

  return (
    <div>
      <Header />
      <ContainerTodo>
        <TodoForm onAddTodoList={addTodoList} />
        <ContainerList>
          <ContainerFavoriteOrNo>
            {list.filter((item) => item.isFavorited).length > 0 && (
              <p>Favoritas</p>
            )}
            <Task>
              {list
                .filter((item) => {
                  return item.isFavorited;
                })
                .map((task) => (
                  <TodoList
                    key={task.id}
                    task={task}
                    onDelete={deleteTodoListById}
                    onChecked={toggleFavorited}
                    onEdit={editTodoListById}
                    onColorEdit={editColorById}
                  />
                ))}
            </Task>
          </ContainerFavoriteOrNo>
          <ContainerFavoriteOrNo>
            {list.filter((item) => !item.isFavorited).length > 0 && (
              <p>Outras</p>
            )}
            <Task>
              {list
                .filter((item) => {
                  return !item.isFavorited;
                })
                .map((task) => (
                  <TodoList
                    key={task.id}
                    task={task}
                    onDelete={deleteTodoListById}
                    onChecked={toggleFavorited}
                    onEdit={editTodoListById}
                    onColorEdit={editColorById}
                  />
                ))}
            </Task>
          </ContainerFavoriteOrNo>
        </ContainerList>
      </ContainerTodo>
    </div>
  );
}
