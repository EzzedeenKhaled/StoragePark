import '../src/assets/Styles/Footer.css';
import { LuCopyright } from 'react-icons/lu';
import {GrTwitter} from 'react-icons/gr';
import {AiOutlineInstagram, AiFillLinkedin, AiFillYoutube} from 'react-icons/ai'
import {BsFacebook} from 'react-icons/bs'
const footer = () => {

    return (
        <div className='footer_comp'>
            <div className='upper'>
                <div className="left">
                    <img src='/logo_d.png' alt="logo" width='150px' height='70px'/>
                    <p>storagepark.lb@gmail.com <br></br>00961 01 123 456</p>
                </div>
                <div className="right">
                <span>Keep up to date on industry trends and news</span>
                <div className='icons'>
                    <div className='icon'><GrTwitter size={25}/></div>
                    <div className='icon'><AiOutlineInstagram size={30}/></div>
                    <div className='icon'><AiFillLinkedin size={30}/></div>
                    <div className='icon'><BsFacebook size={25}/></div>
                    <div className='icon'><AiFillYoutube size={30}/></div>
                </div>
                </div>
            </div>
            <div className="down"><LuCopyright/> StoragePark</div>
        </div>
    );
}

export default footer;