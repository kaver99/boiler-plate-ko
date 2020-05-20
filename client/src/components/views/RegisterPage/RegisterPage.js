import React, { useState } from 'react'

// [REDUX]
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {

    // [REDUX]
    const dispatch = useDispatch();
    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    
    // onChange 이벤트를 통해 해당 input의 value를 변경함
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    // onChange 이벤트를 통해 해당 input의 value를 변경함
    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }
    // onChange 이벤트를 통해 해당 input의 value를 변경함
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    // onChange 이벤트를 통해 해당 input의 value를 변경함
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();  // page Refresh 처리가 되는 것을 방지

        if(Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
        }

        let body = {
            email: Email,
            name: Name,
            password: Password
        }

        dispatch(registerUser(body)).then(response => {
            if(response.payload.success) {
                // withRouter(RegisterPage) 로 export 해야 아래 push 사용 가능
                // react-router-dom을 이용해서 history.push를 사용하는 것임
                props.history.push('/login'); // 시작페이지 이동
            } else {
                alert('Failed to sign up.'); // 오류 Alert
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

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                <br />
                <button type="submit">회원 가입</button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage);
