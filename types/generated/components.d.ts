import type { Schema, Struct } from '@strapi/strapi';

export interface AboutAbout extends Struct.ComponentSchema {
  collectionName: 'components_about_abouts';
  info: {
    displayName: 'About';
  };
  attributes: {
    Description: Schema.Attribute.Blocks;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Mobile_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Title: Schema.Attribute.String;
  };
}

export interface AboutFounder extends Struct.ComponentSchema {
  collectionName: 'components_about_founders';
  info: {
    displayName: 'Founder';
  };
  attributes: {
    Founder_card: Schema.Attribute.Component<'about.founder-card', true>;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface AboutFounderCard extends Struct.ComponentSchema {
  collectionName: 'components_about_founder_cards';
  info: {
    displayName: 'Founder_card';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Description: Schema.Attribute.Blocks;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Slug: Schema.Attribute.String;
    ViewCard: Schema.Attribute.Component<'about.view-card', false>;
  };
}

export interface AboutLegacy extends Struct.ComponentSchema {
  collectionName: 'components_about_legacies';
  info: {
    displayName: 'Legacy';
  };
  attributes: {
    Description: Schema.Attribute.Blocks;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface AboutTeam extends Struct.ComponentSchema {
  collectionName: 'components_about_teams';
  info: {
    displayName: 'Team';
  };
  attributes: {
    Card: Schema.Attribute.Component<'home.card', true>;
    Frame: Schema.Attribute.Component<'home.card', false>;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface AboutViewCard extends Struct.ComponentSchema {
  collectionName: 'components_about_view_cards';
  info: {
    displayName: 'ViewCard';
  };
  attributes: {
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Link: Schema.Attribute.Text;
  };
}

export interface AddressAddress extends Struct.ComponentSchema {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'address';
  };
  attributes: {};
}

export interface BlogBlog extends Struct.ComponentSchema {
  collectionName: 'components_blog_blogs';
  info: {
    displayName: 'Blog';
  };
  attributes: {
    BlogCard: Schema.Attribute.Component<'blog.blog-card', true>;
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface BlogBlogCard extends Struct.ComponentSchema {
  collectionName: 'components_blog_blog_cards';
  info: {
    displayName: 'BlogCard';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    CreatedDate: Schema.Attribute.Date;
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Slug: Schema.Attribute.String & Schema.Attribute.Unique;
    Title: Schema.Attribute.String;
    ViewCard: Schema.Attribute.Component<'blog.view-card', true>;
  };
}

export interface BlogViewCard extends Struct.ComponentSchema {
  collectionName: 'components_blog_view_cards';
  info: {
    displayName: 'ViewCard';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface CampusCard extends Struct.ComponentSchema {
  collectionName: 'components_campus_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Slug: Schema.Attribute.String;
    Thumbnail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
    ViewCard: Schema.Attribute.Component<'faculty.view-card', true>;
  };
}

export interface CampusFacilities extends Struct.ComponentSchema {
  collectionName: 'components_campus_facilities';
  info: {
    displayName: 'Facilities';
  };
  attributes: {
    Card: Schema.Attribute.Component<'campus.card', true>;
    Heading: Schema.Attribute.String;
    SubHeading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface CampusMenu extends Struct.ComponentSchema {
  collectionName: 'components_campus_menus';
  info: {
    displayName: 'Menu';
  };
  attributes: {
    Description: Schema.Attribute.Blocks;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    SubHeading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    Video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface CourseBanner extends Struct.ComponentSchema {
  collectionName: 'components_course_banners';
  info: {
    displayName: 'banner';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Duration: Schema.Attribute.String;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    SubTitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface CourseBenefit extends Struct.ComponentSchema {
  collectionName: 'components_course_benefits';
  info: {
    displayName: 'benefit';
  };
  attributes: {
    Card: Schema.Attribute.Component<'home.card', true>;
    Heading: Schema.Attribute.String;
    SubHeading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface CourseCard extends Struct.ComponentSchema {
  collectionName: 'components_course_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Heading: Schema.Attribute.String;
    Icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface CourseContentCard extends Struct.ComponentSchema {
  collectionName: 'components_course_content_cards';
  info: {
    displayName: 'Content_card';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    OuterDescription: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    OuterTitle: Schema.Attribute.String;
    Section: Schema.Attribute.String;
    Title: Schema.Attribute.String;
    Type: Schema.Attribute.Enumeration<
      [
        'Type1',
        'Type2',
        'Type3',
        'Type4',
        'Type5',
        'Type6',
        'Type7',
        'Type8',
        'Type9',
        'Type10',
      ]
    > &
      Schema.Attribute.DefaultTo<'Type1'>;
  };
}

export interface CourseCourseModule extends Struct.ComponentSchema {
  collectionName: 'components_course_course_modules';
  info: {
    displayName: 'course_module';
  };
  attributes: {
    Content_card: Schema.Attribute.Component<'course.content-card', true>;
    Description: Schema.Attribute.Text;
    Duration: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface CourseCourseOverView extends Struct.ComponentSchema {
  collectionName: 'components_course_course_over_views';
  info: {
    displayName: 'course_over_view';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CourseDipProfessional extends Struct.ComponentSchema {
  collectionName: 'components_course_dip_professionals';
  info: {
    displayName: 'Course';
  };
  attributes: {
    Course_content: Schema.Attribute.Component<'course.course-module', false>;
    course_list: Schema.Attribute.Relation<
      'oneToOne',
      'api::course-list.course-list'
    >;
    Faq: Schema.Attribute.Component<'course.faq', false>;
    HowToApply: Schema.Attribute.Component<'course.how-to-apply', false>;
    Menu: Schema.Attribute.Component<'course.banner', false>;
    Name: Schema.Attribute.String;
    Other_Info: Schema.Attribute.Component<'course.other-info', false>;
    Overview: Schema.Attribute.Component<'course.benefit', false>;
    Student_testimonial: Schema.Attribute.Component<'home.testimonial', true>;
    Testimonial: Schema.Attribute.Component<'home.lla-testimonials', true>;
  };
}

export interface CourseFaq extends Struct.ComponentSchema {
  collectionName: 'components_course_faqs';
  info: {
    displayName: 'faq';
  };
  attributes: {
    QA: Schema.Attribute.Component<'course.qa', true>;
    Title: Schema.Attribute.String;
  };
}

export interface CourseHowToApply extends Struct.ComponentSchema {
  collectionName: 'components_course_how_to_applies';
  info: {
    displayName: 'How_to_apply';
  };
  attributes: {
    Card: Schema.Attribute.Component<'course.card', true>;
    Title: Schema.Attribute.String;
  };
}

export interface CourseInfo extends Struct.ComponentSchema {
  collectionName: 'components_course_infos';
  info: {
    displayName: 'Info';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface CourseOtherInfo extends Struct.ComponentSchema {
  collectionName: 'components_course_other_infos';
  info: {
    displayName: 'Other Info';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Info: Schema.Attribute.Component<'course.info', true>;
    Title: Schema.Attribute.String;
  };
}

export interface CourseQa extends Struct.ComponentSchema {
  collectionName: 'components_course_qas';
  info: {
    displayName: 'QA';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface CourseStudentReview extends Struct.ComponentSchema {
  collectionName: 'components_course_student_reviews';
  info: {
    displayName: 'student_review';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface EducationDetailsEducationDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_education_details_education_details';
  info: {
    displayName: 'Education_Details';
  };
  attributes: {
    Education_Details_10th_std: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Education_Details_12th_std: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface FacultyFaculty extends Struct.ComponentSchema {
  collectionName: 'components_faculty_faculties';
  info: {
    displayName: 'Menu';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    SubHeading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface FacultyFilmmaking extends Struct.ComponentSchema {
  collectionName: 'components_faculty_filmmakings';
  info: {
    displayName: 'Filmmaking';
  };
  attributes: {
    Card: Schema.Attribute.Component<'campus.card', true>;
    Description: Schema.Attribute.Blocks;
    Title: Schema.Attribute.String;
  };
}

export interface FacultyPhotography extends Struct.ComponentSchema {
  collectionName: 'components_faculty_photographies';
  info: {
    displayName: 'Photography';
  };
  attributes: {
    Card: Schema.Attribute.Component<'campus.card', true>;
    Description: Schema.Attribute.String;
    Heading: Schema.Attribute.String;
    SubHeading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface FacultyViewCard extends Struct.ComponentSchema {
  collectionName: 'components_faculty_view_cards';
  info: {
    displayName: 'ViewCard';
    icon: 'code';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface FacultyVisiting extends Struct.ComponentSchema {
  collectionName: 'components_faculty_visitings';
  info: {
    displayName: 'Visiting';
  };
  attributes: {
    Card: Schema.Attribute.Component<'campus.card', true>;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    SubHeading: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface FaqBanner extends Struct.ComponentSchema {
  collectionName: 'components_faq_banners';
  info: {
    displayName: 'banner';
  };
  attributes: {
    img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface FaqFaq extends Struct.ComponentSchema {
  collectionName: 'components_faq_faqs';
  info: {
    displayName: 'faq';
  };
  attributes: {
    Qa: Schema.Attribute.Component<'faq.qa', true>;
    Title: Schema.Attribute.String;
  };
}

export interface FaqQa extends Struct.ComponentSchema {
  collectionName: 'components_faq_qas';
  info: {
    displayName: 'QA';
  };
  attributes: {
    Answer: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Question: Schema.Attribute.String;
  };
}

export interface GalleryGallery extends Struct.ComponentSchema {
  collectionName: 'components_gallery_galleries';
  info: {
    displayName: 'Gallery';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Type: Schema.Attribute.Enumeration<['Video', 'Gallery']>;
    Url: Schema.Attribute.Text;
  };
}

export interface HomeAbout extends Struct.ComponentSchema {
  collectionName: 'components_home_abouts';
  info: {
    displayName: 'About';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface HomeBanner extends Struct.ComponentSchema {
  collectionName: 'components_home_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    Title: Schema.Attribute.String;
    Video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface HomeCampus extends Struct.ComponentSchema {
  collectionName: 'components_home_campuses';
  info: {
    displayName: 'Campus';
  };
  attributes: {
    Bg_img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Btn_txt: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface HomeCard extends Struct.ComponentSchema {
  collectionName: 'components_home_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Btn_txt2: Schema.Attribute.String;
    course_list: Schema.Attribute.Relation<
      'oneToOne',
      'api::course-list.course-list'
    >;
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    LongDescription: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Slug: Schema.Attribute.String;
    Thumbnail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
    Url: Schema.Attribute.Text;
  };
}

export interface HomeCourse extends Struct.ComponentSchema {
  collectionName: 'components_home_courses';
  info: {
    displayName: 'Course';
  };
  attributes: {
    Card: Schema.Attribute.Component<'home.card', true>;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface HomeFaculty extends Struct.ComponentSchema {
  collectionName: 'components_home_faculties';
  info: {
    displayName: 'Faculty';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Card: Schema.Attribute.Component<'home.card', true>;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface HomeGallery extends Struct.ComponentSchema {
  collectionName: 'components_home_galleries';
  info: {
    displayName: 'Gallery';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
    Vertical_Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface HomeLife extends Struct.ComponentSchema {
  collectionName: 'components_home_lives';
  info: {
    displayName: 'Life';
  };
  attributes: {
    Bg_img: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Btn_txt: Schema.Attribute.String;
    Card: Schema.Attribute.Component<'home.card', true>;
    Description: Schema.Attribute.String;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface HomeLlaTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_home_lla_testimonials';
  info: {
    displayName: 'Lla_testimonials';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Slider: Schema.Attribute.Component<'home.slider', true>;
    Title: Schema.Attribute.String;
  };
}

export interface HomeSlider extends Struct.ComponentSchema {
  collectionName: 'components_home_sliders';
  info: {
    displayName: 'Slider';
  };
  attributes: {
    Batch: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Name: Schema.Attribute.String;
  };
}

export interface HomeSponsor extends Struct.ComponentSchema {
  collectionName: 'components_home_sponsors';
  info: {
    displayName: 'Sponsor';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface HomeTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_home_testimonials';
  info: {
    displayName: 'Testimonial';
  };
  attributes: {
    Card: Schema.Attribute.Component<'home.card', true>;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface LanguageAndProficiencyLanguageProficiency
  extends Struct.ComponentSchema {
  collectionName: 'components_language_and_proficiency_language_proficiencies';
  info: {
    displayName: 'Language_Proficiency';
  };
  attributes: {
    language: Schema.Attribute.String;
    read: Schema.Attribute.Boolean;
    speak: Schema.Attribute.Boolean;
    write: Schema.Attribute.Boolean;
  };
}

export interface LanguageLanguageAndProficiency extends Struct.ComponentSchema {
  collectionName: 'components_language_language_and_proficiencies';
  info: {
    displayName: 'Language & Proficiency';
  };
  attributes: {};
}

export interface LifeCardLifeCard extends Struct.ComponentSchema {
  collectionName: 'components_life_card_life_cards';
  info: {
    displayName: 'LifeCard';
  };
  attributes: {
    Btn_txt: Schema.Attribute.String;
    CreatedDate: Schema.Attribute.Date;
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    LifeViewCard: Schema.Attribute.Component<
      'life-view-card.life-view-card',
      true
    >;
    LongDescription: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Slug: Schema.Attribute.String & Schema.Attribute.Unique;
    Title: Schema.Attribute.String;
  };
}

export interface LifeViewCardLifeViewCard extends Struct.ComponentSchema {
  collectionName: 'components_life_view_card_life_view_cards';
  info: {
    displayName: 'LifeViewCard';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface NilgirisImageCard extends Struct.ComponentSchema {
  collectionName: 'components_nilgiris_image_cards';
  info: {
    displayName: 'ImageCard';
  };
  attributes: {
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Type: Schema.Attribute.Enumeration<['Image', 'Video']>;
    Url: Schema.Attribute.Text;
  };
}

export interface ParentGuardianSpouseDetailsParentGuardianSpouseDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_parent_guardian_spouse_details_parent_guardian_spouse_details';
  info: {
    displayName: ' Parent/Guardian/Spouse Details';
  };
  attributes: {};
}

export interface ParentGuardianSpouseParentGuardianSpouseDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_parent_guardian_spouse_parent_guardian_spouse_details';
  info: {
    displayName: 'Parent_Guardian_Spouse_Details';
  };
  attributes: {
    address: Schema.Attribute.Blocks;
    city: Schema.Attribute.String;
    district: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    first_name: Schema.Attribute.String;
    last_name: Schema.Attribute.String;
    mobile_no: Schema.Attribute.BigInteger;
    nationality: Schema.Attribute.String;
    pincode: Schema.Attribute.String;
    profession: Schema.Attribute.String;
    state: Schema.Attribute.Relation<'oneToOne', 'api::state.state'>;
    title: Schema.Attribute.Enumeration<['Mr.', 'Ms.', 'Mrs.']>;
  };
}

export interface PostGraduatePostGraduate extends Struct.ComponentSchema {
  collectionName: 'components_post_graduate_post_graduates';
  info: {
    displayName: 'Post_Graduate';
  };
  attributes: {
    degree: Schema.Attribute.String;
    marksheet: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    pg_status: Schema.Attribute.Enumeration<['Finished', 'In-Progress']>;
  };
}

export interface PrivacyPolicyPrivacyPolicy extends Struct.ComponentSchema {
  collectionName: 'components_privacy_policy_privacy_policies';
  info: {
    displayName: 'PrivacyPolicy';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface SeoHome extends Struct.ComponentSchema {
  collectionName: 'components_seo_homes';
  info: {
    displayName: 'home';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface TermsAndConditionTermsAndCondition
  extends Struct.ComponentSchema {
  collectionName: 'components_terms_and_condition_terms_and_conditions';
  info: {
    displayName: 'Terms&Condition';
  };
  attributes: {
    Description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    Title: Schema.Attribute.String;
  };
}

export interface UnderGraduateUnderGraduate extends Struct.ComponentSchema {
  collectionName: 'components_under_graduate_under_graduates';
  info: {
    displayName: 'Under_Graduate';
  };
  attributes: {
    degree: Schema.Attribute.String;
    marksheet: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    ug_status: Schema.Attribute.Enumeration<['Finished', 'In-Progress']>;
  };
}

export interface UploadYourPortfolioUploadYourPortfolio
  extends Struct.ComponentSchema {
  collectionName: 'components_upload_your_portfolio_upload_your_portfolios';
  info: {
    displayName: 'Upload_Your_Portfolio';
  };
  attributes: {
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface WorkExperienceWorkExperience extends Struct.ComponentSchema {
  collectionName: 'components_work_experience_work_experiences';
  info: {
    displayName: 'Work_Experience';
  };
  attributes: {
    designation: Schema.Attribute.String;
    duration_end: Schema.Attribute.Date;
    duration_start: Schema.Attribute.Date;
    employer: Schema.Attribute.String;
    reference_letter: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.about': AboutAbout;
      'about.founder': AboutFounder;
      'about.founder-card': AboutFounderCard;
      'about.legacy': AboutLegacy;
      'about.team': AboutTeam;
      'about.view-card': AboutViewCard;
      'address.address': AddressAddress;
      'blog.blog': BlogBlog;
      'blog.blog-card': BlogBlogCard;
      'blog.view-card': BlogViewCard;
      'campus.card': CampusCard;
      'campus.facilities': CampusFacilities;
      'campus.menu': CampusMenu;
      'course.banner': CourseBanner;
      'course.benefit': CourseBenefit;
      'course.card': CourseCard;
      'course.content-card': CourseContentCard;
      'course.course-module': CourseCourseModule;
      'course.course-over-view': CourseCourseOverView;
      'course.dip-professional': CourseDipProfessional;
      'course.faq': CourseFaq;
      'course.how-to-apply': CourseHowToApply;
      'course.info': CourseInfo;
      'course.other-info': CourseOtherInfo;
      'course.qa': CourseQa;
      'course.student-review': CourseStudentReview;
      'education-details.education-details': EducationDetailsEducationDetails;
      'faculty.faculty': FacultyFaculty;
      'faculty.filmmaking': FacultyFilmmaking;
      'faculty.photography': FacultyPhotography;
      'faculty.view-card': FacultyViewCard;
      'faculty.visiting': FacultyVisiting;
      'faq.banner': FaqBanner;
      'faq.faq': FaqFaq;
      'faq.qa': FaqQa;
      'gallery.gallery': GalleryGallery;
      'home.about': HomeAbout;
      'home.banner': HomeBanner;
      'home.campus': HomeCampus;
      'home.card': HomeCard;
      'home.course': HomeCourse;
      'home.faculty': HomeFaculty;
      'home.gallery': HomeGallery;
      'home.life': HomeLife;
      'home.lla-testimonials': HomeLlaTestimonials;
      'home.slider': HomeSlider;
      'home.sponsor': HomeSponsor;
      'home.testimonial': HomeTestimonial;
      'language-and-proficiency.language-proficiency': LanguageAndProficiencyLanguageProficiency;
      'language.language-and-proficiency': LanguageLanguageAndProficiency;
      'life-card.life-card': LifeCardLifeCard;
      'life-view-card.life-view-card': LifeViewCardLifeViewCard;
      'nilgiris.image-card': NilgirisImageCard;
      'parent-guardian-spouse-details.parent-guardian-spouse-details': ParentGuardianSpouseDetailsParentGuardianSpouseDetails;
      'parent-guardian-spouse.parent-guardian-spouse-details': ParentGuardianSpouseParentGuardianSpouseDetails;
      'post-graduate.post-graduate': PostGraduatePostGraduate;
      'privacy-policy.privacy-policy': PrivacyPolicyPrivacyPolicy;
      'seo.home': SeoHome;
      'terms-and-condition.terms-and-condition': TermsAndConditionTermsAndCondition;
      'under-graduate.under-graduate': UnderGraduateUnderGraduate;
      'upload-your-portfolio.upload-your-portfolio': UploadYourPortfolioUploadYourPortfolio;
      'work-experience.work-experience': WorkExperienceWorkExperience;
    }
  }
}
