import Layout from "./Layout.jsx";

import Home from "./Home";

import AddResource from "./AddResource";

import ResourceDetail from "./ResourceDetail";

import MyActivity from "./MyActivity";

import GratitudeWall from "./GratitudeWall";

import MyProfile from "./MyProfile";

import Events from "./Events";

import Circles from "./Circles";

import CircleDetail from "./CircleDetail";

import LearnMADDS from "./LearnMADDS";

import HowItWorks from "./HowItWorks";

import FAQ from "./FAQ";

import BulkShare from "./BulkShare";

import HonorCode from "./HonorCode";

import PrivacyPolicy from "./PrivacyPolicy";

import RequestResource from "./RequestResource";

import BrowseNeeds from "./BrowseNeeds";

import NeedDetail from "./NeedDetail";

import Marketplace from "./Marketplace";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    AddResource: AddResource,
    
    ResourceDetail: ResourceDetail,
    
    MyActivity: MyActivity,
    
    GratitudeWall: GratitudeWall,
    
    MyProfile: MyProfile,
    
    Events: Events,
    
    Circles: Circles,
    
    CircleDetail: CircleDetail,
    
    LearnMADDS: LearnMADDS,
    
    HowItWorks: HowItWorks,
    
    FAQ: FAQ,
    
    BulkShare: BulkShare,
    
    HonorCode: HonorCode,
    
    PrivacyPolicy: PrivacyPolicy,
    
    RequestResource: RequestResource,
    
    BrowseNeeds: BrowseNeeds,
    
    NeedDetail: NeedDetail,
    
    Marketplace: Marketplace,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/AddResource" element={<AddResource />} />
                
                <Route path="/ResourceDetail" element={<ResourceDetail />} />
                
                <Route path="/MyActivity" element={<MyActivity />} />
                
                <Route path="/GratitudeWall" element={<GratitudeWall />} />
                
                <Route path="/MyProfile" element={<MyProfile />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Circles" element={<Circles />} />
                
                <Route path="/CircleDetail" element={<CircleDetail />} />
                
                <Route path="/LearnMADDS" element={<LearnMADDS />} />
                
                <Route path="/HowItWorks" element={<HowItWorks />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/BulkShare" element={<BulkShare />} />
                
                <Route path="/HonorCode" element={<HonorCode />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/RequestResource" element={<RequestResource />} />
                
                <Route path="/BrowseNeeds" element={<BrowseNeeds />} />
                
                <Route path="/NeedDetail" element={<NeedDetail />} />
                
                <Route path="/Marketplace" element={<Marketplace />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}