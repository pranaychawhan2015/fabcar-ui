import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';


export default class ChangeOwner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: this.props.match.params.key,
            owner: '',
            redirect: false,
            car: {},
            options : [
                { value: ['Manager','Owner'], label: 'Manager and Owner Approvals' },
                { value: ['Sales'], label: 'Sales Department Approvals' },
                { value: ['Manufacturer'], label: 'Manufacturer Approvals' }
              ],
            policies : [],
            policyName : ''
        }
        //this.onSelect = this.onSelect.bind(this);
        //this.onRemove = this.onRemove.bind(this);
        //console.log(this);
    }

    onOwnerChanged(e) { this.setState({ owner: e.target.value }) }

    onFormSubmit(e) {
        e.preventDefault();
        this.props.setLoading(true);
        axios.put('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars', {
            key: this.state.key,
            owner: this.state.owner,
            policies: this.state.policies
        }).then(res => {
            this.props.setLoading(false);
            if (res.data.status) {
                alert(res.data.message);
                this.setState({redirect: true})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        });
    }

    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/cars/' + this.props.match.params.key).then(res => {
            this.props.setLoading(false);
            if (res.data.status) {
                this.setState({car: res.data.car});
            } else {
                alert(res.data.error.message);
                this.setState({redirect: true});
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        })
    }

    onPolicyChanged(e)
    {
        e.preventDefault();
        console.log(e.target.value);
        this.state.policies = [];
        this.state.policies.push(e.target.value);
        this.setState({policyName: e.target.value, policies: this.state.policies})

        // this.state.policies.push(e.target.value);
        // this.state.policies.forEach(element=>{
        //     console.log(element);
        // })
        console.log(this.state.policies);
        //console.log(e.target.value);        
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }

        const info = typeof this.state.car.owner !== 'undefined' ? <div className="row">
            <div className="col s12">
            <table className='striped responsive-table'>
                <tbody>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Key :</td><td>{this.state.key}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Make :</td><td>{this.state.car.make}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Model :</td><td>{this.state.car.model}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Color :</td><td>{this.state.car.color}</td></tr>
                    <tr><td style={{width: '50%', textAlign: 'right'}}>Old Owner :</td><td>{this.state.car.owner}</td></tr>                    
                </tbody>
            </table>
            </div>
        </div> : <h6>Loading information...</h6>
        return (
            <div>
                <h4>Old Information</h4>
                {info}

                <h4>Change Owner</h4>
                <div className="row">
                    <form className="col s12" onSubmit={this.onFormSubmit.bind(this)}>        
                        <div className="row">
                            <input disabled id="key" type="hidden" className="validate" value={this.state.key} />
                            <div className="input-field col s12">
                                <input id="owner" type="text" className="validate" required value={this.state.owner} onChange={this.onOwnerChanged.bind(this)} />
                                <label htmlFor="owner">New Owner</label>
                            </div>
                        </div>

                        <div className="row">
                {/* <h4>Select Policy</h4> */}
                {/* <Multiselect 
options={this.state.options} // Options to display in the dropdown
selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="label" // Property name to display in the dropdown options
/> */}

<select className='browser-default' required value={this.state.policyName} onChange={this.onPolicyChanged.bind(this)}>
                                                       <option value=""   disabled>Choose policy</option>
                                                       <option label="Manager and Owner Approvals" value={[['Manager'],['Owner']]}>Manager and Owner Approvals</option>
                                                       <option value={["Sales"]} label='Sales Department Approvals'>Sales Department Approvals</option>
                                                       <option value={["Manufacturer"]} label='Manufacturer Approvals'>Manufacturer Approvals</option>        
</select>

                        </div>

                        <div className='row'>
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">Submit
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    onSelect(selectedList, selectedItem) {
        selectedItem.value.forEach(element => {
            this.state.policies.push(element);
        });
    }
    
    onRemove(selectedList, removedItem) {
        removedItem.value.forEach(element => {
            this.state.policies.pop(element);
        });   
    }
}