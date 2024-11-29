import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Button, Form, Title,FormGroup,Label, Input,Select,Textarea, P} from "./styled.js"
import { useNavigate } from 'react-router-dom'

const CadasForm = () => {

    const [sargento, setSargento] = React.useState("")
    const [equipe, setEquipe] = React.useState("")
    const [concluido, setConcluido] = React.useState(false)
    const [solucao, setSolucao] = React.useState("")
    const [message, setMessage] = React.useState("")
    const [loading, setLoading] = React.useState("")

    const navigate = useNavigate()
    

    const getAgente = async () => {
      const token = localStorage.getItem("authToken")

      try {
        const response = await axios.get("http://localhost:3000/usuario/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          }}) 
        console.log(response.data)
        setSargento(response.data.nome)
      } catch (error) {
        console.log(error)
      }
    }

    const handlePost = async (event) => {

        
        event.preventDefault();

        setLoading("Carregando...")

        if(sargento == ""){
          setMessage("Agente não identificado")
        }
        const token = localStorage.getItem("authToken")
        try {

            await axios.post("http://localhost:3000/ocorrencias/criar", {
                sargento,
                equipe,
                concluido,
                solucao            
            }, {
            headers: {
              Authorization: `Bearer ${token}`,
            }})
            setMessage("Cadastro adicionado com sucesso!")
            setEquipe('')
            setConcluido(false)
            setSolucao('')
            navigate("/tabela-ocorrencias")
        } catch (error) {
            setMessage("Não foi possível adicionar esse cadastro!")
            console.error(error)
        }
    }

    
    useEffect(() => {
      const getAll = async () => {
        await getAgente()
      }

      getAll()
    }, [])

    console.log(concluido)


  return (
    <Form onSubmit={handlePost}>

    <Title>Cadastro de Atendimento</Title>
        <FormGroup>
          <Label htmlFor="equipe">Equipe</Label>
          <Input type="text" 
            placeholder="Digite o nome da equipe"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            /> 
        </FormGroup>
        <br />
          <FormGroup> 
          <Label htmlFor="concluido">Concluido</Label>
        <Select  value={concluido} name="concluido" id="concluido" onChange={(e) => setConcluido(e.target.value === "true")}>
          <option value="true" >Sim</option>
          <option selected  value="false">Não</option>
        </Select>
        </FormGroup>  
          <FormGroup>

          <Label htmlFor="solucao">Qual foi a solução aplicada?</Label>
          <Textarea  
            placeholder="Digite qual foi a solução aplicada"
            value={solucao}
            onChange={(e) => setSolucao(e.target.value)}
          />
        </FormGroup>
        <br />
        {message ? <P>{message}</P> : <P>{loading}</P>}
      <Button type="submit">
        ENVIAR
      </Button>
    </Form>
  
  )
}

export default CadasForm;