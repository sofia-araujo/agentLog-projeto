import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import "../Styles/grafico.css"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Graficos = () => {
  const [usuarios, setUsuarios] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [dataValues, setDataValues] = React.useState([]);

  const fetchOcorrenciaData = async () => {

    const token = localStorage.getItem("authToken")

      try {
        const response = await axios.get("http://localhost:3000/usuario/count-ocorrencia", {
          headers: {
            Authorization: `Bearer ${token}`,
          }})

        const data = response.data  

        console.log(data)

        const usuarioNames = data.map(item => item.usuario.nome); 
        const ocorrenciasCount = data.map(item => item.total_ocorrencias); 

        setLabels(usuarioNames); 
        setDataValues(ocorrenciasCount); 
        setUsuarios(data); 
      } catch (error) {
        console.log(error)
      }
  }

  useEffect(() => {
    const getAll = async () => {
      await fetchOcorrenciaData()
    }

    getAll()
  }, [])

  const data = {
    labels: labels, 
    datasets: [
      {
        label: 'Total de Ocorrências',
        data: dataValues, 
        backgroundColor: '#bde40f', 
        borderColor: '#bde40f',
        borderWidth: 1,
        barThickness: 40, 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total de Ocorrências por Usuário',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          max: Math.max(...dataValues) + 1, 
          min: 0,  
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 5, 
      },
    },

    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
  };

  return (
    <div className='grafico'>
      <Bar data={data} options={options} />
    </div>
  )
}

export default Graficos