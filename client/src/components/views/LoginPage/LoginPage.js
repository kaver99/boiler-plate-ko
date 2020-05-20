import React, { useState } from 'react';

// [REDUX]
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';


function LoginPage(props) {
    // [REDUX]
    const dispatch = useDispatch();


    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    // onChange 이벤트를 통해 해당 input의 value를 변경함
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    // onChange 이벤트를 통해 해당 input의 value를 변경함
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();  // page Refresh 처리가 되는 것을 방지

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body)).then(response => {
            if(response.payload.loginSuccess) {
                // withRouter(LoginPage) 로 export 해야 아래 push 사용 가능
                // react-router-dom을 이용해서 history.push를 사용하는 것임
                props.history.push('/'); // 시작페이지 이동
            } else {
                alert('Error"'); // 오류 Alert
            }
        });
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default withRouter(LoginPage);