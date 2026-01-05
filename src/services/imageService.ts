interface TravelPhoto {
  id: string;
  url: string;
  description: string;
  alt: string;
}

interface ProfileAvatar {
  id: string;
  url: string;
  description: string;
  alt: string;
}

class ImageService {
  getTravelCoverPhotos(): TravelPhoto[] {
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        description: 'Mountains and Lake',
        alt: 'Beautiful mountain landscape with lake'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        description: 'Tropical Beach',
        alt: 'Tropical beach with palm trees'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        description: 'City Skyline',
        alt: 'Modern city skyline at sunset'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
        description: 'Forest Path',
        alt: 'Misty forest trail'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        description: 'Desert Dunes',
        alt: 'Golden desert sand dunes'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800',
        description: 'Ocean Waves',
        alt: 'Powerful ocean waves crashing'
      }
    ];
  }

  getProfileAvatars(): ProfileAvatar[] {
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        description: 'Professional Male',
        alt: 'Professional male avatar'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
        description: 'Professional Female',
        alt: 'Professional female avatar'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        description: 'Casual Male',
        alt: 'Casual male avatar'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        description: 'Casual Female',
        alt: 'Casual female avatar'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        description: 'Young Male',
        alt: 'Young male avatar'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        description: 'Young Female',
        alt: 'Young female avatar'
      }
    ];
  }

  async searchUnsplashPhotos(query: string): Promise<TravelPhoto[]> {
    // Mock implementation - in real app you'd use Unsplash API
    const mockResults = this.getTravelCoverPhotos().filter(photo =>
      photo.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return Promise.resolve(mockResults);
  }
}

export const imageService = new ImageService();
export type { TravelPhoto, ProfileAvatar };