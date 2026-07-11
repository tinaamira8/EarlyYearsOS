
export interface APSTStandard {
  id: string;
  title: string;
  description: string;
  focusAreas: { id: string; title: string; description: string }[];
}

export const APST_STANDARDS: APSTStandard[] = [
  {
    id: '1',
    title: 'Know students and how they learn',
    description: 'Demonstrate knowledge and understanding of physical, social and intellectual development and characteristics of students and how these may affect learning.',
    focusAreas: [
      { id: '1.1', title: 'Physical, social and intellectual development and characteristics of students', description: 'Demonstrate knowledge and understanding of physical, social and intellectual development and characteristics of students and how these may affect learning.' },
      { id: '1.2', title: 'Understand how students learn', description: 'Demonstrate knowledge and understanding of research into how students learn and the implications for teaching.' },
      { id: '1.3', title: 'Students with diverse linguistic, cultural, religious and socioeconomic backgrounds', description: 'Demonstrate knowledge of teaching strategies that are responsive to the learning strengths and needs of students from diverse linguistic, cultural, religious and socioeconomic backgrounds.' },
      { id: '1.4', title: 'Strategies for teaching Aboriginal and Torres Strait Islander students', description: 'Demonstrate broad knowledge and understanding of the impact of culture, cultural identity and linguistic background on the education of students from Aboriginal and Torres Strait Islander backgrounds.' },
      { id: '1.5', title: 'Differentiate teaching to meet the specific learning needs of students across the full range of abilities', description: 'Demonstrate knowledge and understanding of strategies for differentiating teaching to meet the specific learning needs of students across the full range of abilities.' },
      { id: '1.6', title: 'Strategies to support full participation of students with disability', description: 'Demonstrate broad knowledge and understanding of legislative requirements and teaching strategies that support participation and learning of students with disability.' }
    ]
  },
  {
    id: '2',
    title: 'Know the content and how to teach it',
    description: 'Demonstrate knowledge and understanding of the concepts, substance and structure of the content and teaching strategies of the teaching area.',
    focusAreas: [
      { id: '2.1', title: 'Content and teaching strategies of the teaching area', description: 'Demonstrate knowledge and understanding of the concepts, substance and structure of the content and teaching strategies of the teaching area.' },
      { id: '2.2', title: 'Content selection and organisation', description: 'Organise content into an effective learning and teaching sequence.' },
      { id: '2.3', title: 'Curriculum, assessment and reporting', description: 'Use curriculum, assessment and reporting knowledge to design learning sequences and lesson plans.' },
      { id: '2.4', title: 'Understand and respect Aboriginal and Torres Strait Islander people to promote reconciliation between Indigenous and non-Indigenous Australians', description: 'Demonstrate broad knowledge and understanding of and respect for Aboriginal and Torres Strait Islander histories, cultures and languages.' },
      { id: '2.5', title: 'Literacy and numeracy strategies', description: 'Know and understand literacy and numeracy teaching strategies and their application in teaching areas.' },
      { id: '2.6', title: 'Information and Communication Technology (ICT)', description: 'Implement teaching strategies for using ICT to expand curriculum learning opportunities for students.' }
    ]
  },
  {
    id: '3',
    title: 'Plan for and implement effective teaching and learning',
    description: 'Set explicit, challenging and achievable learning goals for all students.',
    focusAreas: [
      { id: '3.1', title: 'Establish challenging learning goals', description: 'Set learning goals that provide achievable challenges for students of varying abilities and characteristics.' },
      { id: '3.2', title: 'Plan, structure and sequence learning programs', description: 'Plan lesson sequences using knowledge of student learning, content and effective teaching strategies.' },
      { id: '3.3', title: 'Use teaching strategies', description: 'Include a range of teaching strategies.' },
      { id: '3.4', title: 'Select and use resources', description: 'Demonstrate knowledge of a range of resources, including ICT, that engage students in their learning.' },
      { id: '3.5', title: 'Use effective classroom communication', description: 'Demonstrate a range of verbal and non-verbal communication strategies to support student engagement.' },
      { id: '3.6', title: 'Evaluate and improve teaching programs', description: 'Demonstrate broad knowledge of strategies that can be used to evaluate teaching programs to improve student learning.' },
      { id: '3.7', title: 'Engage parents/carers in the educative process', description: 'Describe a range of strategies for involving parents/carers in the educative process.' }
    ]
  },
  {
    id: '4',
    title: 'Create and maintain supportive and safe learning environments',
    description: 'Identify strategies to support inclusive student participation and engagement in classroom activities.',
    focusAreas: [
      { id: '4.1', title: 'Support student participation', description: 'Identify strategies to support inclusive student participation and engagement in classroom activities.' },
      { id: '4.2', title: 'Manage classroom activities', description: 'Demonstrate the capacity to organise classroom activities and provide clear directions.' },
      { id: '4.3', title: 'Manage challenging behaviour', description: 'Demonstrate knowledge of practical approaches to manage challenging behaviour.' },
      { id: '4.4', title: 'Maintain student safety', description: 'Describe strategies that support students' wellbeing and safety working within school and/or system, curriculum and legislative requirements.' },
      { id: '4.5', title: 'Use ICT safely, responsibly and ethically', description: 'Demonstrate an understanding of the relevant issues and the strategies available to support the safe, responsible and ethical use of ICT in learning and teaching.' }
    ]
  },
  {
    id: '5',
    title: 'Assess, provide feedback and report on student learning',
    description: 'Demonstrate understanding of assessment strategies, including informal and formal, diagnostic, formative and summative approaches to assess student learning.',
    focusAreas: [
      { id: '5.1', title: 'Assess student learning', description: 'Demonstrate understanding of assessment strategies, including informal and formal, diagnostic, formative and summative approaches to assess student learning.' },
      { id: '5.2', title: 'Provide feedback to students on their learning', description: 'Demonstrate an understanding of the purpose of providing timely and appropriate feedback to students about their learning.' },
      { id: '5.3', title: 'Make consistent and comparable judgements', description: 'Demonstrate understanding of assessment moderation and its application to support consistent and comparable judgements of student learning.' },
      { id: '5.4', title: 'Interpret student data', description: 'Demonstrate the capacity to interpret student assessment data to evaluate student learning and modify teaching practice.' },
      { id: '5.5', title: 'Report on student achievement', description: 'Demonstrate understanding of a range of strategies for reporting to students and parents/carers and the purpose of keeping accurate and reliable records of student achievement.' }
    ]
  },
  {
    id: '6',
    title: 'Engage in professional learning',
    description: 'Demonstrate an understanding of the role of the Australian Professional Standards for Teachers in identifying professional learning needs.',
    focusAreas: [
      { id: '6.1', title: 'Identify and plan professional learning needs', description: 'Demonstrate an understanding of the role of the Australian Professional Standards for Teachers in identifying professional learning needs.' },
      { id: '6.2', title: 'Engage in professional learning and improve practice', description: 'Understand the relevant and appropriate sources of professional learning for teachers.' },
      { id: '6.3', title: 'Engage with colleagues and improve practice', description: 'Seek and apply constructive feedback from supervisors and teachers to improve teaching practices.' },
      { id: '6.4', title: 'Apply professional learning and improve student learning', description: 'Demonstrate an understanding of the rationale for continued professional learning and the implications for improved student learning.' }
    ]
  },
  {
    id: '7',
    title: 'Engage professionally with colleagues, parents/carers and the community',
    description: 'Understand the implications of and comply with relevant legislative, administrative, organisational and professional requirements, policies and processes.',
    focusAreas: [
      { id: '7.1', title: 'Meet professional ethics and responsibilities', description: 'Understand the implications of and comply with relevant legislative, administrative, organisational and professional requirements, policies and processes.' },
      { id: '7.2', title: 'Comply with legislative, administrative and organisational requirements', description: 'Understand the relevant legislative, administrative and organisational policies and processes required for teachers according to school stage.' },
      { id: '7.3', title: 'Engage with the parents/carers', description: 'Understand strategies for working effectively, sensitively and confidentially with parents/carers.' },
      { id: '7.4', title: 'Engage with professional teaching networks and broader communities', description: 'Understand the role of external professionals and community representatives in broadening teachers' professional knowledge and practice.' }
    ]
  }
];
