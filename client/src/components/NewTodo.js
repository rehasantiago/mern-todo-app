import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import url from "./url";

class NewTodo extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            media: '',
            loading: false,
            target_date: '2020-11-30',
            status: 'Todo',
            errors: {},
            success: '',
        };
    }

    onChange = e => {
        if (!e.target.id) {
            this.setState({ status: e.target.value });
        } else {
            this.setState({ [e.target.id]: e.target.value });
        }
    };

    uploadImage = async (base64EncodedImage) => {
        console.log("in uploadImage fn")
        try {
            let res = await fetch(`${url}/todos/api/upload`, {
                method: 'POST',
                body: JSON.stringify({ data: base64EncodedImage }),
                headers: { 'Content-Type': 'application/json' },
            });
            res = await res.json();
            this.setState({
                errors: {
                    ...this.state.errors,
                    file: null
                }
            })
            return res.link;
        } catch (err) {
            console.error(err, "here");
            this.setState({
                errors: {
                    ...this.state.errors,
                    file: "File size too large"
                }
            })
        }
    };

    handleFileInputChange = (e) => {
        const file = e.target.files[0];
        console.log(e.target.files[0]);
        this.setState({ media: file });
    };

    addTodo = (mediaUrl = '') => {

        const newTodo = {
            title: this.state.title,
            description: this.state.description,
            media: mediaUrl,
            target_date: this.state.target_date,
            status: this.state.status,
        };

        axios.post(`${url}/todos/add`, newTodo,
            {
                headers: { "Content-Type": "application/json" }
            })
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        title: '',
                        description: '',
                        media: '',
                        target_date: '2020-11-30',
                        status: 'Todo',
                        errors: {},
                        success: '',
                        loading: false,
                    });
                    this.setState({
                        success: "Todo added successfully"
                    })

                }
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    this.setState({
                        errors: err.response.data
                    })
                }
            })

    }

    onSubmit = e => {

        e.preventDefault();


        const reader = new FileReader();
        if (this.state.media) {
            reader.readAsDataURL(this.state.media);
            reader.onloadend = async () => {
                let url = await this.uploadImage(reader.result);
                if (!this.state.errors.file) {
                    this.setState({
                        loading: true
                    })
                    this.addTodo(url);
                }
            };
        } else {
            this.addTodo();
        }


    };
    render() {
        const { errors, loading } = this.state;
        return (
            <Container style={{
                display: "grid",
                placeItems: "center",
                height: "80vh"
            }}>
                <div className="row forms">
                    <div className="col s8">
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <TextField
                                    onChange={this.onChange}
                                    value={this.state.title}
                                    error={errors.title}
                                    id="title"
                                    type="text"
                                    label="title"
                                    required
                                />

                                <span style={{ color: "red" }}>{errors.title}</span>
                            </div>
                            <div>
                                <TextField
                                    onChange={this.onChange}
                                    value={this.state.description}
                                    error={errors.description}
                                    id="description"
                                    type="text"
                                    label="description"
                                    required
                                />

                                <span style={{ color: "red" }}>{errors.description}</span>
                            </div>
                            <br />
                            <Button
                                variant="contained"
                                component="label"
                                onChange={this.handleFileInputChange}
                                id="media"
                                value={this.state.media}
                            >
                                Upload File
                               <input
                                    type="file"
                                    hidden
                                    accept=".mp4,.png,.jpg,.jpeg"
                                />
                            </Button>
                            {this.state.media && this.state.media.name}
                            <br />
                            <br />
                            <TextField
                                id="target_date"
                                label="Target date"
                                type="date"
                                defaultValue="2020-11-30"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.onChange}
                            />
                            <br />
                            <br />
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                label="status"
                                id="status"
                                value={this.state.status}
                                onChange={this.onChange}
                            >
                                <MenuItem value="Todo">Todo</MenuItem>
                                <MenuItem value="In-progress">In-progress</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                            </Select>
                            <br />
                            <span style={{ color: "red" }}>{errors.file}</span>

                            <div className="col s12" style={{}}>
                                <Button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem",
                                        marginBottom: "1rem"
                                    }}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Add
                               </Button>
                                <br />
                            </div>
                        </form>
                        {
                            loading ? <Loader
                                type="Circles"
                                color="#00BFFF"
                                height={40}
                                width={40}

                            /> : null
                        }
                        <span style={{ color: "green" }}>{this.state.success}</span>
                        <br />
                        <Link to="/">Go back to todos page</Link>
                    </div>
                </div>
            </Container>
        );
    }
}

export default NewTodo