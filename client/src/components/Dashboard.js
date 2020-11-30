import React, { useEffect, useState } from "react";
import { Delete } from "@material-ui/icons";
import MaterialTable from "material-table";
import tableIcons from "./TableIcons.js";
import Container from '@material-ui/core/Container';
import axios from "axios";
import url from "./url";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

export default function AppTable() {
    const [data, setData] = useState(false);

    const handleDeleteRows = (event, rowData) => {
        let _data = [...data];
        let todoList = []
        rowData.forEach(rd => {
            _data.filter(t => t.tableData.id === rd.tableData.id ? todoList.push(t) : '');
            _data = _data.filter(t => t.tableData.id !== rd.tableData.id);
        });
        const reqData = JSON.stringify({ "todoList": todoList.map((todo) => todo.mongoId) });
        console.log(reqData)
        const config = {
            method: 'post',
            url: `${url}/todos/delete`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: reqData
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

        // console.log('new data', _data)
        console.log('delete these ids', todoList)
        setData(_data);
    };

    const getTodos = async () => {
        const config = {
            method: 'get',
            url: `${url}/todos/get`,
            headers: {}
        };
        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                let tableData = response.data.todos.map((todo) => {
                    return {
                        title: todo.title,
                        description: todo.description,
                        media: todo.media,
                        target_date: todo.target_date,
                        status: todo.status,
                        mongoId: todo._id
                    }
                })
                setData(tableData);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const updateData = async (data) => {
        console.log(data)
        await axios.post(`${url}/todos/update`,
            data,
            {
                headers: { "Content-Type": "application/json" }
            })
        console.log("here");
    }

    useEffect(() => {
        getTodos()
    }, [])

    return (
        <Container>
            {data ? <MaterialTable
                title="Select row(s) to get the option to delete"
                columns={[
                    { title: 'Title', field: 'title', sorting: false },
                    { title: 'Description', field: 'description', sorting: false },
                    { title: 'Media link', field: 'media', render: rowData => rowData.media && <a href={rowData.media} target="_blank">Media</a>, editable: 'never', sorting: false },
                    {
                        title: 'Target Date',
                        field: 'target_date',
                        customSort: (a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime(),
                        render: rowData => rowData.target_date && new Date(rowData.target_date).toDateString(),
                        editable: 'never',
                    },
                    { title: 'Status', field: 'status', lookup: { "Todo": 'Todo', "In-progress": 'In-progress', "Done": "Done" }, sorting: false },
                ]}
                data={data}
                icons={tableIcons}
                actions={[
                    {
                        icon: () => <Delete />,
                        tooltip: "Delete Rows",
                        onClick: handleDeleteRows
                    }
                ]}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataUpdate = [...data];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                setData([...dataUpdate])
                                console.log('dataUpdate', dataUpdate)
                                updateData({
                                    id: newData.mongoId,
                                    title: newData.title,
                                    description: newData.description,
                                    media: newData.media ? newData.media : '',
                                    target_date: newData.target_date ? newData.target_date : '',
                                    status: newData.status,
                                })

                                resolve();
                            }, 1000)
                        }),
                }}
                options={{
                    sorting: true,
                    selection: true,
                    pageSize: 20
                }}
            /> : 'Loading...'}
            <br/>

            <Button variant="contained" color="primary">
                <Link to='/create' style={{ color: "white", textDecoration: "none" }}>New Todo</Link>
            </Button>
        </Container>
    );
}
