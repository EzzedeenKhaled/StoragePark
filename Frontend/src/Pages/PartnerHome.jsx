import '../assets/Styles/HomeP.css';
import { useNavigate } from "react-router-dom";
// import React, { useState} from "react";
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
// import OrderTrackModal from '../../components/Modals/OrderTrackModal';
const Landing = () => {
    const navigate = useNavigate();
    // const [openModal, setOpenModal] = useState(false);

    // const handleCloseModal = () => {
    //     setOpenModal(false);
    // }

    // const handleOpenModal = () => {
    //     setOpenModal(true);
    // }

    return (
        <div className='Landing_page'> 
            <div className='nav_section'> <NavBar/> </div>
            <div className='body'>
                <div className="section hero">
                    <div className='right'>
                        <h1>Streamlined Solutions for Your Business</h1>
                        <p>
                        Storage Park couples powerful software with its flexible nationwide fulfillment network, enabling brands to offer consistently efficient, 
                        cost-effective delivery that improves the customer experience, from every channel.
                        </p>
                        <button onClick={() => navigate('/register-partner-1')}>
                            Become a Partner
                            </button>
                    </div>
                    <div><img src='/p1.png' alt='hero image'></img></div>
                </div>

                <div className='hero2'>
                        <h1>Our Services</h1>
                        <div className='solutions'>
                            <div className="solution">
                                
                                <img src='/s1.png' alt=""/>
                                <p>
                                    Obsessive
                                    <br/>
                                    Onboarding
                                </p>
                            </div>
                            <div className="solution">
                               
                                <img src='/s2.png' alt=""/> 
                                <p className="">
                                    Value-Added
                                    <br/>
                                    Services
                                </p>
                            </div>

                            <div className="solution">
                                
                                <img src='/s3.png' alt=""/>
                                <p>
                                    Tailored
                                    <br/>
                                    Engineered Solutions
                                </p>
                            </div>
                            <div className="solution">
                                
                                <img src='/s4.png' alt=""/>
                                <p>
                                    Scalable
                                    <br/>
                                    Integrations
                                </p>
                            </div>

                            <div className="solution">
                                
                                <img src='/s5.png' alt=""/> 
                                <p>
                                    Robust
                                    <br/>
                                    Realtime Portal
                                </p>
                            </div>
                        </div>
                                                   
                </div>
                <div className='section hero3'><img src='/hero3.png' alt='image'></img></div>
            </div>
            <div className="footer"><Footer/></div>
            {/* <OrderTrackModal
            handleCloseModal={handleCloseModal}
            openModal={openModal}
            /> */}
        </div>
    );
}

export default Landing;