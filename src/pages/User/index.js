import React, {Component} from 'react';
import Git from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {
    TextTop,
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Location,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    Loading,
    LoadingMore,
} from './style';
import api from '../../services/api';

export default class User extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <>
                <Git name="star" size={35} color="#fff" />
                <TextTop>{navigation.getParam('user').name}</TextTop>
            </>
        ),
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: true,
        loadingMore: false,
        page: 1,
        refreshing: false,
    };

    async componentDidMount() {
        this.load();
    }

    load = async (page = 1) => {
        const {stars} = this.state;
        const {navigation} = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {page},
        });

        this.setState({
            stars: page > 1 ? [...stars, ...response.data] : response.data,
            page,
            loading: false,
            loadingMore: false,
            refreshing: false,
        });
    };

    loadMore = () => {
        this.setState({loadingMore: true});
        const {page} = this.state;
        const nextPage = page + 1;
        this.load(nextPage);
    };

    refreshList = () => {
        this.setState({refreshing: true, stars: []}, this.load);
    };

    handleNavigate = repository => {
        const {navigation} = this.props;
        navigation.navigate('Repository', {repository});
    };

    render() {
        const {navigation} = this.props;
        const {stars, loading, loadingMore, refreshing} = this.state;
        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{uri: user.avatar}} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                    <Location>{user.location}</Location>
                </Header>
                {loading ? (
                    <Loading />
                ) : (
                    <Stars
                        data={stars}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        onRefresh={this.refreshList}
                        refreshing={refreshing}
                        keyExtractor={star => String(star.id)}
                        renderItem={({item}) => (
                            <Starred onPress={() => this.handleNavigate(item)}>
                                <OwnerAvatar
                                    source={{uri: item.owner.avatar_url}}
                                />
                                <Info>
                                    <Title>{item.name}</Title>
                                    <Author>{item.owner.login}</Author>
                                </Info>
                            </Starred>
                        )}
                    />
                )}
                {loadingMore ? <LoadingMore /> : <></>}
            </Container>
        );
    }
}
