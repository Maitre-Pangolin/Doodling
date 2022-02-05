import avatar from "../avatar.jpg";

const Player = ({ playerInfo }) => {
  return (
    <div className='flex items-center   border-2 md:w-[400px]'>
      <img src={avatar} alt='avatar' className='w-32 rounded-md' />
      <p className='text-xl font-bold text-left grow pl-4'>
        {playerInfo.username}
      </p>
    </div>
  );
};

export default Player;
