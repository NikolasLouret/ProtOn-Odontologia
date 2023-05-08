import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {LoginContext} from '../context/LoginContext'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import { Button } from '@mui/material';

import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

import styles from '../css/HomeInstituicao.module.css'
import Logo from '../img/logo.png'



export default function HomeInstituicao() {
    const [dentistas, setDentistas] = useState([])
    const [open, setOpen] = useState(false);
    const {user} = useContext(LoginContext)
    console.log(user)

    useEffect(() => {
        /*fetch(`http://localhost:3000/api/instituicao/${user._id}/dentistas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(resp => resp.json())
          .then(data => setDentistas(data))
          .catch(err => console.error(err))*/
          setDentistas(user.dentistas)
    }, [dentistas])

        
    const messageRemove = () => {
        setOpen(true);
    };
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const rows = [];

    dentistas.forEach(dentista => {
        rows.push(createData(dentista.name, dentista.matricula, dentista.email, dentista._id ))
    });
    
    function createData(name, email, matricula, id) {
        return { name, email, matricula, id };
    }  

    function deleteDentista(id){
        fetch(`http://localhost:3000/api/dentista?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            if(resp.ok) {
                setDentistas(dentistas.filter(dentista => dentista.id !== id))
            }
        }).catch(err => console.error(err))
    }



    return (
    <div className={styles.body}>
        <div className={styles.logo}>
            <img src={Logo} alt="Logo" />
        </div>
        <div className={styles.divButtonCreate}>
            <Button variant="contained" href='/formDentista'>Adicionar dentista</Button>
        </div>
        <div className={styles.tableContainer}>
            <TableContainer component={Paper} className={styles.table}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell align="right">Matrícula</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                    <TableRow
                        key={row._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {row.name}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">{row.matricula}</TableCell>
                        <TableCell align="right">
                            <Link to={`/editDentista/${row.id}`} className={styles.buttonCrud}>
                                <EditIcon className={styles.icon} />
                            </Link>
                        </TableCell>
                        <TableCell align="right"><button className={styles.buttonCrud} onClick={() => {
                            deleteDentista(row.id)
                            messageRemove()
                        }}><DeleteIcon className={styles.icon}/></button></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                Dentista removido com sucesso!
            </Alert>
        </Snackbar>
    </div>

    );
}