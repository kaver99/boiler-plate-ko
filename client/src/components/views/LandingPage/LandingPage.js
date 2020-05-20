import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';


function LandingPage(props) {

    const [data, setData] = useState("");

    useEffect(() => {
        Axios.get('/api/hello').then(response => { setData(response.data) });
    }, []);

    const onClickHandler = () => {
        Axios.get('/api/users/logout').then(response => {
            if(response.data.success) {
                // withRouter(LandingPage) 로 export 해야 아래 push 사용 가능
            // react-router-dom을 이용해서 history.push를 사용하는 것임
                props.history.push("/login");
            } else {
                alert('로그아웃 하는데 실패 했습니다.');
            }
        });
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            LandingPage. {data}

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage);