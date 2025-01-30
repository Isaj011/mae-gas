import { onBoarding } from '@/constants';
import { router } from 'expo-router';
import React, {useRef, useState} from 'react';
import {Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper'

const Onboarding = () => {
    const swiperRef = useRef<Swiper>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <SafeAreaView className='flex h-full justify-between items-center bg-white'>
            <TouchableOpacity className='w-full flex justify-end items-end p-4' onPress={() => {
                router.replace('/(auth)/sign-up')
            }}>
                <Text className='text-black text-md font-JakartaBold'>Skip</Text>
            </TouchableOpacity>
            <Swiper
            ref={swiperRef}
            loop={false}
            dot={<View className='w-[30px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full' />}
            activeDot={<View className='w-[30px] h-[4px] mx-1 bg-[#0286FF] rounded-full' />}
            onIndexChanged={(index)=> setActiveIndex(index)}
            >
                {onBoarding.map((item) => (
                    <View>
                       <Text>{item.title}</Text>
                    </View>
                ))}
            </Swiper>
        </SafeAreaView>
    );
}


export default Onboarding;
