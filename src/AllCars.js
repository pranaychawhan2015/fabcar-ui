import React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

export default class AllCars extends React.Component {
    constructor() {
        super();
        this.state = {
            cars: []
        }
    }
    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars').then(res => {
            this.props.setLoading(false);
            if(res.data.status) {
                this.setState({cars: res.data.cars})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        })
    }

    render() {
        const tbody = this.state.cars.map(car => {
            return <tr style={{border: "3px solid rgb(0, 0, 0)"}}>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{car.Key}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{car.Record.make}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{car.Record.model}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{car.Record.color}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{car.Record.owner}</td>
                <td>
                    <Link to={'/change-owner/' + car.Key} className="waves-effect waves-light btn light-blue darken-3"><i className="material-icons">edit</i></Link>
                </td>
            </tr>
        })
        return (
            <div>
                <h4>All Cars</h4>
                <table className='striped responsive-table centered'>
                    <thead>
                        <tr>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Name</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Make</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Model</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Color</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Owner</th>
                            <th style={{width: 100,border: "3px solid rgb(0, 0, 0)"}}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tbody}
                    </tbody>
                </table>
            </div>
        )
    }
}