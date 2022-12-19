import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RankingWrapper,
  Header,
  Title,
  Button,
  MoreButton,
  Main,
  Number,
  ContentBox,
  Left,
  Like,
  StoreName,
  TotalLike,
} from './style';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { HiHeart } from 'react-icons/hi';
import axios from 'axios';

interface Iprops {
  country: string;
  closeModal: () => void;
  showWholeMap: () => void;
}

interface Icontent {
  country: string;
  like: number;
  store: string;
  image: string;
}

const Ranking = (props: Iprops) => {
  const { country, closeModal, showWholeMap } = props;
  const [data, setData] = useState<any[]>([]);
  const getPostData = () => {
    return axios({
      method: 'get',
      // 임시 mock data 연결
      url: 'http://localhost:3001/Data/post.json',
    }).then((res) => {
      setData(res.data.data);
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      await getPostData();
    };
    fetchData();
  }, []);

  return (
    <RankingWrapper>
      <Header>
        <Title>{country}</Title>
        <Button
          className="closeBtn"
          onClick={() => {
            closeModal();
            showWholeMap();
          }}
        >
          <IoCloseCircleOutline />
        </Button>
      </Header>
      <Link to={`/list/${country}`}>
        <MoreButton>more</MoreButton>
      </Link>
      {data.map((content: Icontent, index: number) => {
        return (
          <Main key={index}>
            {content.country === country ? (
              <ContentBox>
                <Left>
                  <div>
                    <Number>{index + 1}</Number>
                    <Like>
                      <HiHeart />
                      <TotalLike>{content.like}</TotalLike>
                    </Like>
                  </div>
                  <StoreName>{content.store}</StoreName>
                </Left>
                <img src={content.image} alt={content.store}></img>
              </ContentBox>
            ) : (
              <></>
            )}
          </Main>
        );
      })}
    </RankingWrapper>
  );
};

export default Ranking;