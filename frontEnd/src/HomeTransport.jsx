import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomeTransport() {
    const { client_id, country_id, tours_id } = useParams();
    const [transport, setTransport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8081/transport/${client_id}/${country_id}/${tours_id}`)
            .then((res) => {
                console.log("Transport data received:", res.data);
                setTransport(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching transport:", err);
                setError('Failed to load transport');
                setLoading(false);
            });
    }, [tours_id]);
    

    const handleSelectTransport = (transport_id) => {
        axios.post(`http://localhost:8081/assign-transport`, { client_id, country_id, tours_id, transport_id })
            .then(() => {
                navigate(`/summary/${client_id}/${country_id}/${tours_id}/${transport_id}`);
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="d-flex vh-100 overflow-auto position-relative bg-white justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <h2>Select a Transport</h2>
                <div className="d-flex justify-content-end">
                    <Link to={`/tours/${client_id}/${country_id}`} className="btn btn-primary">Back</Link>
                </div>

                <h3>Available Transport in {country_id}</h3>
                {loading && <p>Loading transport...</p>}
                {error && <p>{error}</p>}
                <ul className="list-group">
                    {transport.length > 0 ? (
                        transport.map((item) => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <span><strong>{item.transport_type}</strong> - {item.company}</span><br />
                                    <span><strong>Flight Number:</strong> {item.flight_number || "N/A"}</span><br />
                                    <span><strong>Start City:</strong> {item.start_city}</span><br />
                                    <span><strong>End City:</strong> {item.end_city}</span><br />
                                    <span><strong>Start Date:</strong> {new Date(item.start_date).toLocaleDateString()}</span><br />
                                    <span><strong>End Date:</strong> {new Date(item.end_date).toLocaleDateString()}</span><br />
                                    <span><strong>Travel Time:</strong> {item.travel_time}</span><br />
                                    <span><strong>Country:</strong> {item.country}</span><br />
                                </div>
                                <button
                                    className='btn btn-success btn-sm'
                                    onClick={() => handleSelectTransport(item.id)}
                                >
                                    Choose
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>No transport available</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default HomeTransport;
