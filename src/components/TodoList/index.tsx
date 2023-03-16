import Image from "next/image";
import { useState, } from "react";

import { CardTodoList, CardHeader, FooterTodoList, Title, TextAreaTodoList, TextAreaNew, Button } from "../CardsStyles/styles";
import favoriteCheked from "../../../public/favoriteCheked.svg"
import favoriteNoCheked from "../../../public/favoriteNoCheked.svg"
import colors from "../../../public/colors.svg"
import edit from "../../../public/edit.svg"
import vectorX from "../../../public/vectorX.svg"
import { ITodoList } from "../../pages/index";

interface Props {
    todoList: ITodoList;   
    onDelete: (todoListId: string) => void 
    onChecked: (todoListId: string) => void 
  }

export default function TodoList( {todoList, onDelete, onChecked}:Props  ){

    return(
        <CardTodoList >                     
            <CardHeader>
                <Title/>
                    <button 
                        onClick={() => onChecked(todoList.id)}
                    >
                        {
                        todoList.ischecked ? <Image src={favoriteCheked} alt="" /> : <Image src={favoriteNoCheked} alt="" />
                        }
                    </button>
            </CardHeader>                  
            <TextAreaTodoList>{todoList.textAreaTodoList}</TextAreaTodoList>                      
                   
                        
            <FooterTodoList>
                <div> 
                    <button>
                        <Image src={edit} alt="" />
                    </button>
                    <button>
                        <Image src={colors} alt="" />
                    </button>
                    </div>
                <button onClick={() => onDelete(todoList.id)}>
                    <Image src={vectorX} alt="" />
                </button>
            </FooterTodoList>
        
        </CardTodoList>   
    )
}