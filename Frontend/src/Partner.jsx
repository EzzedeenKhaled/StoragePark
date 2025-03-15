import Navbar from "./Navbar";
function Partner() {
    return (
        <>
            <Navbar />
            <div style={{ position: 'relative' }}>
                <div style={{ position:'absolute', bottom:'250px', left:'120px' }}>
                    <h2 style={{ 
                        color: 'black', 
                        width:'230px', 
                        margin:'0px', 
                        }}>
                        Streamlined Solutions for Your Business
                    </h2>
                </div>
            </div>
        </>
    );
}


export default Partner;
