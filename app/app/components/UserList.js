import { ListGroup, Row, Col, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import md5 from 'md5';

const UserList = ({ users, activeUsers, userActive, handleSelectUser }) => {
    return (
        <ListGroup>
            {users
                .sort((a, b) => {
                    const aIsActive = activeUsers.includes(a.id);
                    const bIsActive = activeUsers.includes(b.id);

                    if (aIsActive && !bIsActive) return -1;
                    if (!aIsActive && bIsActive) return 1;

                    return a.name.localeCompare(b.name);
                })
                .map((user) => (
                    <ListGroup.Item
                        key={user.id}
                        className={`${user.id === userActive.id ? 'bg-info text-dark' : ''}`}
                        action
                        onClick={() => handleSelectUser(user)}
                    >
                        <Row>
                            <Col xs={4} lg={2} className="d-flex flex-column justify-content-center">
                                <Image src={`https://www.gravatar.com/avatar/${md5(user.username)}?d=identicon`} roundedCircle fluid />
                            </Col>
                            <Col xs={8} lg={10} className="d-flex flex-column justify-content-center">
                                <span><Icon.CircleFill className={activeUsers.includes(user.id) ? 'text-success' : 'text-danger'} /> {user.name}</span><br />
                                <small>@{user.username}</small>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
        </ListGroup>
    );
};

export default UserList;