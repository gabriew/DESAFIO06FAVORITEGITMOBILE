import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Git from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
    Container,
    Form,
    Input,
    SubmitButton,
    List,
    User,
    Avatar,
    Name,
    Bio,
    Location,
    ProfileButton,
    ProfileButtonText,
    TextTop,
    DeleteUser,
} from './styles';

export default class Main extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        newUser: '',
        users: [],
        loading: false,
    };

    async componentDidMount() {
        const users = await AsyncStorage.getItem('favorite');
        if (users) {
            this.setState({users: JSON.parse(users)});
        }
    }

    componentDidUpdate(_, prevState) {
        const {users} = this.state;
        if (prevState.users !== users) {
            AsyncStorage.setItem('favorite', JSON.stringify(users));
        }
    }

    handleAddUser = async () => {
        const {users, newUser} = this.state;
        this.setState({loading: true});
        const response = await api.get(`/users/${newUser}`);
        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            location: response.data.location,
            avatar: response.data.avatar_url,
        };
        this.setState({
            users: [...users, data],
            newUser: '',
            loading: false,
        });
        Keyboard.dismiss();
    };

    handleNavigate = user => {
        const {navigation} = this.props;
        navigation.navigate('User', {user});
    };

    handleDeleteUser = user => {
        const {users} = this.state;
        const i = users.findIndex(u => u.login === user.login);
        users.splice(i, 1);
        AsyncStorage.removeItem('favorite');
        AsyncStorage.setItem('favorite', JSON.stringify(users));
        this.setState({
            users,
        });
    };

    render() {
        const {users, newUser, loading} = this.state;
        return (
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Add github username"
                        value={newUser}
                        onChangeText={text => this.setState({newUser: text})}
                        returnKeyType="send"
                        onSubmitEditing={this.handleAddUser}
                    />
                    <SubmitButton
                        loading={loading}
                        onPress={this.handleAddUser}>
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Icon
                                name="add-circle-outline"
                                size={20}
                                color="#fff"
                            />
                        )}
                    </SubmitButton>
                </Form>
                <List
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({item}) => (
                        <User>
                            <DeleteUser
                                name="close"
                                size={25}
                                color="#FFF"
                                onPress={() => this.handleDeleteUser(item)}
                            />
                            <Avatar source={{uri: item.avatar}} />
                            <Name>{item.name}</Name>
                            <Bio>{item.bio}</Bio>
                            <Location>{item.location}</Location>
                            <ProfileButton
                                onPress={() => this.handleNavigate(item)}>
                                <ProfileButtonText>Starreds</ProfileButtonText>
                            </ProfileButton>
                        </User>
                    )}
                />
            </Container>
        );
    }
}

Main.navigationOptions = {
    headerTitle: (
        <>
            <Git name="github" size={35} color="#fff" />
            <TextTop>Favorite GitHub`s</TextTop>
        </>
    ),
};
